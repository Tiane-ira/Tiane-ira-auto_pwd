// 后台服务工作者
// 可以在这里添加后台任务，如监听标签页更新等

// 监听标签页更新，执行自动规则
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // 页面加载完成后，通知内容脚本执行自动规则
    // 注意：由于Manifest V3的限制，我们需要通过消息传递
    chrome.tabs.sendMessage(tabId, { action: 'executeAllAutoRules' })
      .catch(() => {
        // 忽略错误（可能是内容脚本未注入或页面不支持）
      });
  }
});

