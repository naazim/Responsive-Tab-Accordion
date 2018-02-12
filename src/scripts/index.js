import 'normalize.css'
import '../styles/styles.scss';

(function () {
    "use strict";

    const AccordionTab = function () {

        let loadAccordionTabs,
            tabConfig,
            createInput,
            createLabel,
            createContent,
            loadContentData,
            history = [];

        this.init = function () {
            loadAccordionTabs("./data/accordionTabs.json", tabConfig); //Fetch & create tabs dynamically
        };

        tabConfig = function (xhr) {

            let wrapper = document.getElementById("accordion-tab"),
                data = JSON.parse(xhr.responseText);
            for (let i = 0; i < data.tabs.length; i++) {
                let tabItem = data.tabs[i],
                    tabLabel = tabItem.title,
                    id = "tab" + (i + 1);
                    
                history[i] = tabItem.selected;  //Set the selected tab status history

                wrapper.appendChild(createRadioInput(id, "tab", "radio", "tab__input", tabItem.selected));
                wrapper.appendChild(createLabel(i + 1, id, "tab__label", tabLabel));
                wrapper.appendChild(createContent("tab__content"));

                if (tabItem.selected) {
                    loadContentData(i + 1); // load the selected tab content first
                }
            }
        };

        /* Create Radio Input field for tab/accordion selection */
        createRadioInput = function (id, name, type, className, checked) {

            let input = document.createElement("input");
            input.id = id;
            input.className = className;
            input.name = name;
            input.type = type;

            if (checked) {
                input.checked = true;
            }

            return input;
        };

        /* Create tab/accordion title label */
        createLabel = function (id, forId, className, text) {

            let label = document.createElement("label");
            label.setAttribute("for", forId);
            label.className = className;
            label.innerHTML = text;
            label.setAttribute("data-key", id);

            label.onclick = function () {
                if(!history[id - 1]) {
                    loadContentData(id);
                    history[id - 1] = true;
                }
            }

            return label;
        };

        /* Create tab/accordion content div */
        createContent = function (className) {
            let div = document.createElement("div");
            div.className = className;

            return div;
        }

        /* Load content data from corresponding json files */
        loadContentData = function (id) {
            let container = document.getElementById("tab" + id).nextElementSibling.nextElementSibling;
            console.log('Loading data for Tab' + id);

            loadAccordionTabs("./data/Tab" + (parseInt(id)) + ".JSON", function (xhr) {
                let content = JSON.parse(xhr.responseText);
                container.innerHTML = '';

                let h2 = document.createElement("h2");
                h2.innerHTML = content.title;
                container.appendChild(h2);

                let p = document.createElement("p");
                p.innerHTML = content.body;
                container.appendChild(p);
            });
        };

        loadAccordionTabs = function (url, callback) {
            let xhr;

            if (typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
            else {
                let versions = ["Microsoft.XmlHttp"]

                for (let i = 0, len = versions.length; i < len; i++) {
                    try {
                        xhr = new ActiveXObject(versions[i]);
                        break;
                    } catch (e) { }
                }
            }

            xhr.onreadystatechange = function () {
                if (xhr.readyState < 4) {
                    return;
                }

                if (xhr.status !== 200) {
                    return;
                }

                // Success
                if (xhr.readyState === 4) {
                    callback(xhr);
                }
            }

            xhr.open('GET', url, true);
            xhr.send('');
        };
    };

    let AccordionTabsApp = new AccordionTab();
    AccordionTabsApp.init();
})();