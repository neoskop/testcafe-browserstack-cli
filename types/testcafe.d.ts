declare module 'testcafe/lib/browser/provider/pool' {
    const ProviderPool: {
        getBrowserInfo(alias: string): Promise<any>;
        getProvider(providerName: string): Promise<any>;
    };

    export = ProviderPool;
}
