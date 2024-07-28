document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded and parsed");
});

let currentConfig = {};

function loadYAML() {
    const yamlFileInput = document.getElementById('yaml-file');
    const file = yamlFileInput.files[0];
    
    if (!file) {
        alert("Please select a YAML file.");
        return;
    }

    const reader = new FileReader();
    
    reader.onload = function(event) {
        const yamlText = event.target.result;
        document.getElementById('yaml-content').textContent = yamlText;
        
        currentConfig = jsyaml.load(yamlText);
        applyConfig(currentConfig);
    };
    
    reader.readAsText(file);
}

function applyConfig(config) {
    const actions = config.actions || [];
    actions.forEach(action => {
        switch(action.type) {
            case 'remove':
                document.querySelectorAll(action.selector).forEach(el => el.remove());
                break;
            case 'replace':
                document.querySelectorAll(action.selector).forEach(el => {
                    const newEl = document.createElement('div');
                    newEl.innerHTML = action.newElement;
                    el.replaceWith(newEl.firstChild);
                });
                break;
            case 'insert':
                const targetEl = document.querySelector(action.target);
                const insertEl = document.createElement('div');
                insertEl.innerHTML = action.element;
                if (action.position === 'before') {
                    targetEl.before(insertEl.firstChild);
                } else if (action.position === 'after') {
                    targetEl.after(insertEl.firstChild);
                }
                break;
            case 'alter':
                document.body.innerHTML = document.body.innerHTML.replace(new RegExp(action.oldValue, 'g'), action.newValue);
                break;
        }
    });

    updateGeneratedContent();
}

function updateGeneratedContent() {
    const generatedContent = document.documentElement.outerHTML;
    document.getElementById('generated-content').textContent = generatedContent;
}
