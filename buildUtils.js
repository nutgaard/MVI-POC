function createStandaloneName(namespace, name) {
    return namespace +  capitalize(name);
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function createGlobalShimConfig(fileConfig, config) {
    var shimConfig = {
        'react': config.namespace.base + "React",
        'React': config.namespace.base + "React"
    };
    config.components.forEach(function(component){
        if (fileConfig.name !== component) {
            shimConfig[component] = createStandaloneName(config.namespace.components, component);
        }
    });
    return shimConfig;
}
function createComponentConfig(srcPath, namespace, componentName) {
    return {
        file: srcPath + componentName + "/index.js",
        namespace: namespace,
        name: componentName,
        standaloneName: createStandaloneName(namespace, componentName)
    };
}

module.exports = {
    createStandaloneName: createStandaloneName,
    capitalize: capitalize,
    createGlobalShimConfig: createGlobalShimConfig,
    createComponentConfig: createComponentConfig
}

