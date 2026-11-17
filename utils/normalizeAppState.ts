const normalizeAppState = (appState: any = {}) => ({
  ...appState,
  collaborators: new Map(),
});