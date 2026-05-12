export const FastCreateItem = ( data, defgroups ) => {
    chrome.storage.local.get(["token"], (token) => {
        chrome.tabs.query({ 'active': true, 'currentWindow': true }, (tabs) => { 
            const url = tabs[0].url;
            const title = tabs[0].title;
            console.log('url: ', url, ' + title: ', title, ' + user id: ', data.id, "defID:" , defgroups.id);
            const ItemData = {
                "default_group_id": defgroups.id,
                "name": title,
                "link": url,
                "description": null,
                "state": 0,
                "tags": [] 
            };

            fetch('https://wet-saver-production.up.railway.app/api/create/item', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(ItemData)
            })
            .then(res => res.json())
            .then(data => {
                chrome.storage.local.get('defgroups', (result) => {
                    const currentGroups = result.defgroups || [];
                    {data.item && (currentGroups[0].items.push(data.item))}
                    chrome.storage.local.set({ "defgroups": currentGroups }, () => {
                        this.setState(prevState => ({
                            defgroups: {
                                ...prevState.defgroups,
                                items: [...(prevState.defgroups.items || []), data.item]
                            }
                        }));
                    });
                })

                console.log('new data: ', data);
            })
        });
        console.log("new data: ", data);
    });
}