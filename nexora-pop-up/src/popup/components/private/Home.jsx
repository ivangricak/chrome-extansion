import React from 'react'
import '../../css/auth.css'
import '../../css/main.css'
import Header from '../header'

class ShowGroup extends React.Component {
    render() {
        const { group, expandedId, ShowItemBody, toggleCard,openCreateForm } = this.props;
        console.log('check:', group);
        const conEdit = group.pivot.role == 0 || group.pivot.role == null;

        // const profileUrl = conEdit ? `/online/profile/${conEdit.id}` : '#';

        return (
            <div className={`card ${expandedId === group.id ? 'expanded' : ''}`} onClick={(e) => toggleCard(e, group.id)} key={group.id}>
                <div className="title-row">
                    <h5 className="group-title">{group.name}</h5>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                            {
                            conEdit ? 
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <button className="update-item nav-link">edit group</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="submit" onClick={() => openCreateForm(group.id)} className="create-item nav-link">create item</button>
                                        </li>
                                        <li><p className="dropdown-divider"></p></li>
                                        <li className="nav-item">
                                            <button type="submit" className="delete-btn-group nav-link">Delete Group</button>
                                        </li>
                                    </ul>
                                :
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className="nav-link" href="">Profile</a>
                                            <button className="nav-link">copy group</button>
                                            <li className="nav-item">
                                                <button type="submit" className="delete-btn-group nav-link">Delete Group</button>
                                            </li>
                                        </li>
                                    </ul>
                            }
                    </div>
                </div>
                <div className="scroll overflow-auto group-scroll">
                    {group.items?.map((item) => (
                        <div className="item-copy" key={item.id}>
                            <div className="item" onClick={() => ShowItemBody(item)} id='item'>
                                <span className="tag">{item.tag || ' '}</span>
                                <span className='item-name'>{item.name}</span>
                            </div>
                            <button className="copy" data-link={item.link} type="button">copy</button>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
    
}

class CreateDefItem extends React.Component {

    render () {

        const { id, closeCreateForm, token, UpdateDefItems} = this.props;
        console.log("token: ", token);

        function saveItem() {
            const tok = chrome.storage.local.get("token", ({token}) => {
            // const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
                const formDiv = document.querySelector('.created-div');
                console.log('show form ather: ', formDiv);
                
                const formData = new FormData(formDiv);
                console.log('show form: ', formData);

                fetch('https://wet-saver-production.up.railway.app/api/create/item', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: formData //тут треба зробити форму правильну!!!
                })
                .then(res => res.json())
                .then(data => {
                    console.log('JSON parsed:', data);

                    formData.append('default_group_id', id);

                    // console.log('con>defItem>created: ', window.defGroupItemsCache);
                    loadDefGroupItems(id);
                    formDiv.remove();
                })
                .catch(err => {
                    console.error('Error:', err);
                    alert('Сталася помилка при створенні item-а');
                });
            });
        }

        function loadDefGroupItems(defgroupId) {
            fetch(`https://wet-saver-production.up.railway.app/api/defgroups/${defgroupId}/items`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    // UpdateDefItems(data);
                    // console.log('data: ', data.items);
                    
                })
                .catch(err => console.error(err));
        }
      

        return (
            <form className="created-div">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" placeholder="name" required/>
                </div>
        
                <div className="mb-3">
                    <label className="form-label">State:</label>
                    <select className="form-select" name="state">
                        <option value={1}>Public</option>
                        <option value={0}>Private</option>
                    </select>
                </div>

                <input type="hidden" name="default_group_id" value={id} />
                <input type="hidden" name="group_id" value="" />
        
                <div className="mb-3">
                    <label className="form-label">Link</label>
                    <input type="text" className="form-control" name="link" placeholder="link"/>
                </div>
        
                <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea className="form-control" rows="3" name="description"></textarea>
                </div>
        
                <button type="button" onClick={() => saveItem()} className="create btn btn-success m-2">Create</button>
                <button type="button" onClick={() => closeCreateForm()} className="close-div btn btn-danger m-2">Закрити</button>
            </form>
        )
    }
}

class ShowDefGroup extends React.Component {
    
    render () {
        const { defgroup, expandedId, ShowItemBody, toggleCard, openCreateForm, items} = this.props;

        console.log('defItem: ', defgroup);
        return (
            <div className={`card ${expandedId === defgroup.id ? 'expanded' : ''}`} onClick={(e) => toggleCard(e, defgroup.id)} key={defgroup.id}>
                <div className="title-row">
                    <h5 className="mb-3">{defgroup.name}</h5>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                            <li className="nav-item"><button type="submit" className="def-create-item nav-link" onClick={() => openCreateForm(defgroup.id)}>create item</button></li>
                        </ul>
                    </div>
                </div>
                <div className="scroll overflow-auto group-scroll" id={`defgroup-${defgroup.id}`}>
                    {defgroup.items?.map((item) => (
                        <div className="item-copy" key={item.id}>
                            <div className="item" onClick={() => ShowItemBody(item)} id='item'>
                                <span className="tag">{item.tag || ' '}</span>
                                <span>{item.name}</span>
                            </div>
                            <button className="copy" type="button">copy</button>
                        </div>
                    ))}
                    {items?.map((item) => {
                         <div className="item-copy" key={item.id}>
                            <div className="item" onClick={() => ShowItemBody(item)} id='item'>
                                <span className="tag">{item.tag || ' '}</span>
                                <span>{item.name}</span>
                            </div>
                            <button className="copy" type="button">copy</button>
                        </div>
                    })}
                </div>
            </div>
            
        )
    }
}

class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showDefItemForm: false,
            selectDefId: null,
            selectedItem: [],
            expandedId: null,
            groups: [],
            defgroup: [],
            users: [],
            loading: true,
            error: null,
            dropdown: [],
            token: null,
            items: []
        }
    }

    componentDidMount() {
        // chrome.storage.local.remove("token")
        chrome.storage.local.get("token", ({token}) => {
            this.setState({
                token: token
            });
            if (!token) {
                console.log('[NO TOKEN]');
                return;
            } else {
                console.log('[TOKEN]', token);
            }

    
        fetch("https://wet-saver-production.up.railway.app/api/user/groups", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log('all', data);
            this.setState({
                groups: data.groups,
                defgroup: data.default_groups
            })
        })

        fetch("https://wet-saver-production.up.railway.app/users/nicks")
            .then(res => res.json())
            .then(data => {
                this.setState({
                    users: data,
                    loading: false
                })
            })
            .catch(err => {
                this.setState({
                    error: "Помилка завантаження",
                    loading: false
                })
                console.error(err)
            });
        });
    }

    ShowItemBody = (item) => {
        console.log("fdad", item);
        this.setState({
            selectedItem: item
        });
        
        console.log("is", this.state.selectedItem);
    }

    // Extanded() {
    //     // const card = e.target.closest('.card');
    //     // card.classList.add("expanded");
    //     // document.querySelectorAll('.groups .main-container .card').forEach(c => {
    //     //     if (c !== card) c.classList.remove("expanded");
    //     // });
    //     document.querySelector('.groups .main-container').addEventListener('click', (e) => {
    //         const card = e.target.closest('.card');
    //         if (!card) return;

    //         const isExpanded = card.classList.contains('expanded');
        
    //         // Якщо клік був на item, copy, dropdown або в меню — ігноруємо
    //         if (
                // e.target.closest('.item') || 
                // e.target.closest('.copy') || 
                // e.target.closest('.dropdown') || 
                // e.target.closest('.dropdown-menu')
    //         ) return;
        
    //         // Закриваємо всі інші карточки
    //         document.querySelectorAll('.groups .main-container .card').forEach(c => {
    //             if (c !== card) c.classList.remove("expanded");
    //         });
        
    //         // Тогл для поточної
    //         if (!isExpanded) {
    //             card.classList.add("expanded");
    //         } 
    //     });
    // }

    toggleCard = (e, id) => {
        if (
            e.target.closest('.item') || 
            e.target.closest('.copy') || 
            e.target.closest('.dropdown') || 
            e.target.closest('.dropdown-menu')
        ) return;
       
        this.setState({
            expandedId: this.state.expandedId === id ? null : id
        });
    }

    selectedItemClose() {
        this.setState({
            selectedItem: false,
            expandedId: null
        })
    }

    openCreateForm = (id) => {
        this.setState({
            showDefItemForm: true,
            selectDefId: id
        })
    }

    // UpdateDefItems = (items) => {
    //     this.setState(prevState => ({
    //         defgroup: {
    //             ...prevState.defgroup,
    //             items: items
    //         }
    //     }));
    //     console.log('jjj', this.state.defgroup);
    // }

    closeCreateForm = () => {
        this.setState({
            showDefItemForm: false,
            selectDefId: null
        })
    }
   
    render() {
        const { groups, defgroup, users, loading, error, token } = this.state

        console.log('groups', groups);
        return (
            <>
                <main className="overflow-auto" style={{ maxHeight: "450px" }}>
                    <h2>Home</h2>

                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}

                    <div className="default_group">
                        <div className="main-container">
                                {defgroup.map((defg) => (
                                    <>
                                        <ShowDefGroup
                                            key={defg.id}
                                            defgroup={defg}
                                            expandedId={this.state.expandedId}
                                            ShowItemBody={this.ShowItemBody}
                                            toggleCard={this.toggleCard}
                                            openCreateForm={this.openCreateForm}
                                            token={token}
                                        />
                                    </>
                                ))}
                        </div>
                    </div>

                    <div className="groups">
                        <div className="main-container mt-4">
                            {groups.map((group) => (
                                <ShowGroup
                                    key={group.id}
                                    group={group}
                                    expandedId={this.state.expandedId}
                                    ShowItemBody={this.ShowItemBody}
                                    toggleCard={this.toggleCard}
                                    openCreateForm={this.openCreateForm}
                                />
                                
                            ))}
                        </div>
                    </div>
                    {this.state.selectedItem != null && Object.keys(this.state.selectedItem).length > 0 && (
                        <div className="modal" id="itemModal-block">
                            <div className="modal-dialog modal-fullscreen">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="itemModalTitle"></h5>
                                        <button type="button" className="btn-close" onClick={() => this.selectedItemClose()}></button>
                                    </div>
                                    <div className="modal-body" id="itemModalBody">
                                        {/* Завантаження... */}
                                            <>
                                                <div className="item-data">
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control item-field" value={this.state.selectedItem.name} readOnly/>
                                                    </div>
                                                    <select className="form-select mb-2 item-field" value={this.state.selectedItem.state} disabled>
                                                        <option value={1}>Public</option>
                                                        <option value={0}>Private</option>
                                                    </select>
                                                    <div className="input-group mb-3">
                                                        <input type="text" className="form-control item-field" value={this.state.selectedItem.link} readOnly/>
                                                        <button className="btn btn-outline-secondary">📋 copy</button>
                                                    </div>
                                                    <div className="input-group mb-3">
                                                        <textarea className="form-control item-field" rows="6" data-field="description" value={this.state.selectedItem.description} readOnly/>
                                                    </div>
                                                    <button className="btn btn-primary edit-save-btn">Edit</button>
                                                    <button className="btn btn-danger delete-btn">Delete</button>
                                                </div>
                                            </>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                </main>
                {this.state.showDefItemForm && (
                    <CreateDefItem
                        id={this.state.selectDefId}
                        closeCreateForm={this.closeCreateForm}
                        UpdateDefItems={this.UpdateDefItems}
                        token={token}
                        items={this.state.items}
                        />
                )}
            </>
        )
    }
}

export default Home