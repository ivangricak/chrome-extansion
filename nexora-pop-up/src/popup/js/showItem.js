//SHOW ITEM
export function ShowItems() {
    const modal = document.getElementById('itemModal');
    const modalTitle = document.getElementById('itemModalTitle');
    const modalBody = document.getElementById('itemModalBody');

    modal.addEventListener('show.bs.modal', event => {
        const trigger = event.relatedTarget;
        const itemId = trigger.dataset.itemId;
        const groupId = trigger.dataset.groupId ?? null;
        const defGroupId = trigger.dataset.defGroupId ?? null;

        let sourceArray = null;

        if (defGroupId !== null) {
            sourceArray = window.defGroupItemsCache[defGroupId];
        } else if (groupId !== null) {
            sourceArray = window.groupItemsCache[groupId];
        }

        const item = sourceArray?.find(i => String(i.id) === String(itemId));

        modalTitle.textContent = "Завантаження...";
        modalBody.innerHTML = '<p>Завантаження даних...</p>';


        console.log('item: ', item);
        if(item) {
            console.log("used cash: ", item);
            renderModal(item);
        } else {
            fetch(`/items/${itemId}`)
                .then(res => res.json())
                .then(data => {
                    console.log("used fetch: ", data);
                    
                    if (defGroupId !== null && defGroupId !== undefined) {
                        // якщо item з дефолтної групи
                        if (!window.defGroupItemsCache[defGroupId]) {
                            window.defGroupItemsCache[defGroupId] = [];
                        }
                        window.defGroupItemsCache[defGroupId].push(data);
            
                    } else if (groupId !== null && groupId !== undefined) {
                        // якщо item з нормальної групи
                        if (!window.groupItemsCache[groupId]) {
                            window.groupItemsCache[groupId] = [];
                        }
                        window.groupItemsCache[groupId].push(data);
                    }
                    
                    renderModal(data);
                });
        }
        function renderModal(item) {
            console.log(item);
            modalTitle.textContent = item.group_name;

            // const element1 = listItemEl.closest('.title-row');
            // console.log('ele: ', element1);
            modalBody.innerHTML = `
            <div class="item-data">
                <div class="input-group mb-3">
                    <input type="text" class="form-control item-field" data-field="name" value="${item.name}" readonly>
                </div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control item-field" data-field="tags" value="${item.tags.join(', ')}" readonly>
                </div>
                <select class="form-select mb-2 item-field" data-field="state" disabled>
                    <option value="1" ${item.state == 1 ? 'selected' : ''}>Public</option>
                    <option value="0" ${item.state == 0 ? 'selected' : ''}>Private</option>
                </select>
                <div class="input-group mb-3">
                    <input type="text" class="form-control item-field" data-field="link" value="${item.link}" readonly>
                    <button class="btn btn-outline-secondary" onclick="navigator.clipboard.writeText('${item.link}')">📋 copy</button>
                </div>
                <div class="input-group mb-3">
                    <textarea class="form-control item-field" rows="6" data-field="description" readonly>${item.description}</textarea>
                </div>
                <button class="btn btn-primary edit-save-btn" data-id="${item.id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id-group="${item.group_id}" data-id-defgroup="${item.default_group_id}" data-id="${item.id}">Delete</button>
            </div>
            `;
        }
    });
};