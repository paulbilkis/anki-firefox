var cm = browser.contextMenus;
var tabs = browser.tabs;

// settings
var modelName = "Basic"
var deckName = "Default"
var apiAddr = "http://127.0.0.1:8765"
var apiVersion = 6

function invoke(action, version, params={}) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.addEventListener('error', () => reject('failed to issue request'));
        xhr.addEventListener('load', () => {
            try {
                const response = JSON.parse(xhr.responseText);
                if (Object.getOwnPropertyNames(response).length != 2) {
                    throw 'response has an unexpected number of fields';
                }
                if (!response.hasOwnProperty('error')) {
                    throw 'response is missing required error field';
                }
                if (!response.hasOwnProperty('result')) {
                    throw 'response is missing required result field';
                }
                if (response.error) {
                    throw response.error;
                }
                resolve(response.result);
            } catch (e) {
                reject(e);
            }
        });
        xhr.open('POST', apiAddr);
        xhr.send(JSON.stringify({action, version, params}));
    });
}

function createModel (name, fields) {
    
}

function getTranslation (word) {
    
}

async function addWordAnki (word) {    
    params = {
        "note": {
            "deckName": deckName,
            "modelName": modelName,
            "fields": {
                "Front": word,
                "Back": "",
            },
            "options": {
                "closeAfterAdding": true
            },
            "tags": [
              "ankifox"
            ]
        }
    };
    const result = await invoke('guiAddCards', apiVersion, params);
}

cm.create({
    id: "anki-add-word",
    title: "Add to Anki",
    contexts: ["selection"]
});

browser.contextMenus.onClicked.addListener((info, tab) => {
    // Object { menuItemId: "anki-add-word", parentMenuItemId: 712, viewType: "tab", frameId: 0, editable: false, targetElementId: 2247288, pageUrl: "https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions", selectionText: "browser", modifiers: [], button: 0 }
    if (info.menuItemId === "anki-add-word") {
        addWordAnki(info.selectionText);
    }
});
