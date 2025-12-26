// 内容脚本 - 在页面中执行元素选择和填充

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'executeRule') {
    executeRule(request.rule)
      .then(result => sendResponse({ success: true, result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // 保持消息通道开放以支持异步响应
  }
});

// 标准化URL（移除hash和query参数，用于匹配）
function normalizeUrl(url) {
  try {
    const urlObj = new URL(url);
    return `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
  } catch {
    return url;
  }
}

// URL匹配函数
function matchUrl(currentUrl, ruleUrl) {
  const normalizedCurrent = normalizeUrl(currentUrl);
  const normalizedRule = normalizeUrl(ruleUrl);
  
  // 精确匹配
  if (normalizedCurrent === normalizedRule) {
    return true;
  }
  
  // 支持通配符匹配（例如: https://example.com/*）
  if (normalizedRule.endsWith('*')) {
    const prefix = normalizedRule.slice(0, -1);
    return normalizedCurrent.startsWith(prefix);
  }
  
  // 支持路径匹配（例如: /login）
  if (ruleUrl.startsWith('/')) {
    try {
      const urlObj = new URL(currentUrl);
      return urlObj.pathname === ruleUrl || urlObj.pathname.startsWith(ruleUrl);
    } catch {
      return false;
    }
  }
  
  return false;
}

// 检查当前URL是否匹配规则中的网址列表
function matchesCurrentUrl(rule) {
  if (!rule.urls || rule.urls.length === 0) {
    return false;
  }
  
  const currentUrl = window.location.href;
  
  return rule.urls.some(url => matchUrl(currentUrl, url));
}

// 执行单个规则
async function executeRule(rule) {
  try {
    const elements = await findElements(rule.selector, rule.selectorType);
    
    if (elements.length === 0) {
      throw new Error(`未找到匹配的元素: ${rule.selector}`);
    }

    const results = [];
    
    for (const element of elements) {
      try {
        // 只支持填充文本操作
        await fillElement(element, rule.fillValue);
        results.push({ success: true, action: 'fill' });
      } catch (error) {
        results.push({ success: false, error: error.message });
      }
    }

    return {
      found: elements.length,
      executed: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results
    };
  } catch (error) {
    throw error;
  }
}

// 查找元素
function findElements(selector, selectorType) {
  return new Promise((resolve, reject) => {
    try {
      let elements = [];
      
      if (selectorType === 'css') {
        // 使用CSS选择器
        elements = Array.from(document.querySelectorAll(selector));
      } else if (selectorType === 'xpath') {
        // 使用XPath
        const xpathResult = document.evaluate(
          selector,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        
        for (let i = 0; i < xpathResult.snapshotLength; i++) {
          elements.push(xpathResult.snapshotItem(i));
        }
      } else {
        reject(new Error(`不支持的选择器类型: ${selectorType}`));
        return;
      }
      
      resolve(elements);
    } catch (error) {
      reject(error);
    }
  });
}

// 填充元素
function fillElement(element, value) {
  return new Promise((resolve, reject) => {
    try {
      // 触发focus事件
      element.focus();
      element.dispatchEvent(new Event('focus', { bubbles: true }));
      
      // 清空现有值
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = '';
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else if (element.isContentEditable) {
        element.textContent = '';
      }
      
      // 设置新值
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.value = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
      } else if (element.isContentEditable) {
        element.textContent = value;
        element.dispatchEvent(new Event('input', { bubbles: true }));
      } else {
        element.setAttribute('value', value);
      }
      
      // 触发blur事件
      element.dispatchEvent(new Event('blur', { bubbles: true }));
      
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

// 执行匹配当前URL的所有规则 - 优化：批量读取和缓存
let autoFillStatusCache = null;
let rulesCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5000; // 缓存5秒

async function executeMatchingRules() {
  try {
    const now = Date.now();
    
    // 批量读取存储，使用缓存优化
    if (!autoFillStatusCache || !rulesCache || (now - cacheTimestamp) > CACHE_TTL) {
      const result = await chrome.storage.local.get(['autoFillEnabled', 'rules']);
      autoFillStatusCache = result.autoFillEnabled !== false;
      rulesCache = result.rules || [];
      cacheTimestamp = now;
    }
    
    if (!autoFillStatusCache) {
      return { executed: 0, message: '自动填充已关闭' };
    }
    
    if (rulesCache.length === 0) {
      return { executed: 0, message: '没有规则' };
    }
    
    // 筛选匹配当前URL的规则
    const matchingRules = rulesCache.filter(rule => matchesCurrentUrl(rule));
    
    if (matchingRules.length === 0) {
      return { executed: 0, message: '没有匹配当前URL的规则' };
    }
    
    // 并行执行规则（优化性能）
    const results = await Promise.allSettled(
      matchingRules.map(async (rule) => {
        try {
          const result = await executeRule(rule);
          return { 
            ruleId: rule.id, 
            success: true, 
            result 
          };
        } catch (error) {
          return { 
            ruleId: rule.id, 
            success: false, 
            error: error.message 
          };
        }
      })
    );
    
    return {
      executed: matchingRules.length,
      results: results.map(r => r.value || r.reason)
    };
  } catch (error) {
    console.error('执行规则失败:', error);
    throw error;
  }
}

// 页面加载完成后自动执行匹配的规则
function autoExecuteRules() {
  // 等待页面完全加载
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => {
        executeMatchingRules().catch(console.error);
      }, 1000); // 延迟1秒执行，确保页面完全加载
    });
  } else {
    setTimeout(() => {
      executeMatchingRules().catch(console.error);
    }, 1000);
  }
}

// 监听URL变化（SPA应用）- 优化：防抖和节流
let lastUrl = location.href;
let urlChangeTimer = null;
let isExecuting = false;

const urlObserver = new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    
    // 防抖：避免频繁触发
    if (urlChangeTimer) {
      clearTimeout(urlChangeTimer);
    }
    
    urlChangeTimer = setTimeout(() => {
      // 节流：避免重复执行
      if (!isExecuting) {
        isExecuting = true;
        executeMatchingRules()
          .catch(console.error)
          .finally(() => {
            isExecuting = false;
          });
      }
    }, 500);
  }
});

// 使用更精确的观察选项，减少性能开销
urlObserver.observe(document, { 
  subtree: false, 
  childList: true,
  attributes: false,
  characterData: false
});

// 初始化
autoExecuteRules();
