export const setupWorker = (config: any) => {
  const OfflinePluginRuntime = require('offline-plugin/runtime');

  if ('serviceWorker' in window.navigator) {
    OfflinePluginRuntime.install({
      onUpdateReady() {
        console.log('SW Event:', 'onUpdateReady');
        OfflinePluginRuntime.applyUpdate();
      },
      onUpdated() {
        switch (config.autoUpdate) {
          case 'always':
            window.location.reload();
            break;
          case 'confirm':
            if (window.confirm(config.updateMessage)) {
              window.location.reload();
            }
            break;
        }
      },
    });
  }
};
