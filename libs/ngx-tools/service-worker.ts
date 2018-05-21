export const setupWorker = (config: any) => {
  if ('serviceWorker' in window.navigator) {
    import('offline-plugin/runtime').then(m => {
      m.install({
        onUpdateReady() {
          console.log('SW Event:', 'onUpdateReady');
          m.applyUpdate();
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
    });
  }
};
