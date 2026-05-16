import React, { useState } from 'react'
import '../../css/auth.css'
import '../../css/main.css'

class ShowItems extends React.Component {
    render () {
        const { defgroups, OpenLink, onContextMenu, deleteItem } = this.props;
        console.log('defItem: ', defgroups);
        return (
            <div className='ItemList'>
                {defgroups.items?.map((item) => (
                    <div className='Item' key={item.id}>
                        <button className='item-name-FastView text-truncate' onClick={() => OpenLink(item.link)} onContextMenu={(e) => onContextMenu(e, item)} data-bs-toggle='tooltip'> {item.name} </button> <button className='DeleteItemFastView' onClick={() => deleteItem(item)}><i className="bi bi-trash"></i></button>
                    </div>
                ))}
            </div>
        )
    }
}

class FastView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defgroups: null,
            user: null,
            token: null,
            actionMenu: false,

            contextMenu: {
                visible: false,
                x: 0,
                y: 0,
                targetItem: null
            }
        };
    }

    componentDidMount() {
        chrome.storage.local.get(["defgroups", "userId", "token"], (result) => {
            console.log('fee: ', result.defgroups[0]);
            console.log('user: ', result.userId);
            {result.defgroups && this.setState({ defgroups: result.defgroups[0] })}
            {result.userId && this.setState({ user: result.userId })}
            {result.token && this.setState({ token: result.token })}
        });
    }

    handleContextMenu = (event, item) => {
        event.preventDefault(); 
        this.setState({
            contextMenu: {
                visible: true,
                x: event.clientX,
                y: event.clientY,
                targetItem: item
            }
        });
        document.addEventListener('click', this.closeContextMenu);
    }

    deleteItem = (item) => {
        const groupId = item.default_group_id ?? item.group_id;
        const typeOfGroup = item.default_group_id ? 'defgroups' : 'groups';
        chrome.storage.local.get(["token"], (result) => {
            const token = result.token;
            fetch(`https://wet-saver-production.up.railway.app/api/items/${item.id}`,  {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log('itemid:', data.item_id);
                const itemId = data.item_id;
                chrome.storage.local.get('defgroups', (result) => {
                    const currentGroups = result.defgroups || [];
                    {itemId && (currentGroups[0].items = currentGroups[0].items.filter(item => item.id !== itemId))}
                    chrome.storage.local.set({ "defgroups": currentGroups });
                })
                console.log('deleted: ', data);
            })
            .then(() => {
                this.setState(prevState => ({
                    defgroups: {
                        ...prevState.defgroups,
                        items: prevState.defgroups.items.filter(i => i.id !== item.id)
                    }
                }));
            })
            .catch(err => {
                console.error('DELETE ERROR:', err);
            });
        });
    }

    closeContextMenu = () => {
        this.setState({
            contextMenu: {
                visible: false,
                x: 0,
                y: 0,
                targetItem: null
            }
        });
        document.removeEventListener('click', this.closeContextMenu);
    }

    CreateItem = ( data, defgroups ) => {
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

    OpenLink = (data) => {
        chrome.tabs.create({
            url: `${data}`
        });
    }

    OpenMenu = (data) => {
        this.setState({
            actionMenu: data
        })
    }

    render() {
        const { defgroups, user, contextMenu, actionMenu} = this.state;
        console.log('deffff:', defgroups);
        if (!defgroups) {
            return <div className="FastViewContent">Loading...</div>;
        }

        return (
            <>
                <div className="FastViewContent">
                    <ShowItems
                        defgroups={defgroups}
                        OpenLink={this.OpenLink}
                        onCosntextMenu={this.handleContextMenu}
                        deleteItem={this.deleteItem}
                    />
                    {/* {contextMenu.visible && (
                        <div 
                            className="custom-context-menu"
                            style={{ 
                                position: 'absolute', 
                                top: `${contextMenu.y}px`, 
                                left: `${contextMenu.x}px`,
                                zIndex: 1000
                            }}
                        >
                            <button onClick={() => this.OpenLink(contextMenu.targetItem.link)}>Відкрити</button>
                            <button onClick={() => this.deleteItem(contextMenu.targetItem)}>Видалити</button>
                            <button onClick={() => console.log('Редагувати', contextMenu.targetItem)}>Редагувати</button>
                        </div>
                    )} */}
                    {actionMenu && (
                        <>
                            <div className="MenuContainerFastView">
                                <button className='MenuButtomFastView' onClick={this.props.switchToOpenHome}>Home</button>
                            </div>
                        </>
                    )}
                </div>
                <div className='NavBarContainer'>
                    <div className='NavBarLeftBtn' onClick={() => this.CreateItem(user, defgroups)}><button>+ Save link</button></div>
                    <div className='NavBarDropMenu' onClick={() => this.OpenMenu(true)}><button>&#8942;</button></div>
                </div>
            </>
        );
    }
}

export default FastView