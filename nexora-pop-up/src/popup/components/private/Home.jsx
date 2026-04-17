import React, { useState } from 'react'
import '../../css/auth.css'
import '../../css/main.css'
import { useForm } from 'react-hook-form';
import Header from '../header'

class ShowGroup extends React.Component {
    render() {
        const { group, expandedId, ShowItemBody, toggleCard, openCreateForm, typeOfGroup, DeleteGroup, openEditGroupForm } = this.props;
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
                                            <button className="update-item nav-link" onClick={() => openEditGroupForm(group)}>edit group</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="submit" onClick={() => openCreateForm(typeOfGroup, group.id)} className="create-item nav-link">create item</button>
                                        </li>
                                        <li><p className="dropdown-divider"></p></li>
                                        <li className="nav-item">
                                            <button type="submit" className="delete-btn-group nav-link" onClick={() => DeleteGroup(group.id)}>Delete Group</button>
                                        </li>
                                    </ul>
                                :
                                    <ul className="dropdown-menu">
                                        <li className="nav-item">
                                            <a className="nav-link" href="">Profile</a>
                                        </li>
                                        <li className="nav-item">
                                            <button className="nav-link">copy group</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="submit" className="delete-btn-group nav-link" onClick={() => DeleteGroup(group.id)}>Delete Group</button>
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
        const { id, closeCreateForm, token, loadDefGroupItems, typeOfGroup} = this.props;
        function saveItem() {
            chrome.storage.local.get("token", ({token}) => {
                const formDiv = document.querySelector('.created-div');                
                const formData = new FormData(formDiv);
                fetch('https://wet-saver-production.up.railway.app/api/create/item', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: formData
                })
                .then(res => res.json())
                .then(data => {
                    loadDefGroupItems(typeOfGroup ,id);
                })
                .catch(err => {
                    console.error('Error:', err);
                    alert('Сталася помилка при створенні item-а');
                    closeCreateForm();
                });
            });
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

                <input type="hidden" name="default_group_id" value={typeOfGroup === "defgroups" ? id : ""} />
                <input type="hidden" name="group_id" value={typeOfGroup === "groups" ? id : ""} />
        
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
        const { defgroups, expandedId, ShowItemBody, toggleCard, openCreateForm, items, typeOfGroup} = this.props;

        console.log('defItem: ', defgroups);
        return (
            <div className={`card ${expandedId === defgroups.id ? 'expanded' : ''}`} onClick={(e) => toggleCard(e, defgroups.id)} key={defgroups.id}>
                <div className="title-row">
                    <h5 className="mb-3">{defgroups.name}</h5>
                    <div className="dropdown">
                        <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false">
                            <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu">
                            <li className="nav-item"><button type="submit" className="def-create-item nav-link" onClick={() => openCreateForm(typeOfGroup, defgroups.id)}>create item</button></li>
                        </ul>
                    </div>
                </div>
                <div className="scroll overflow-auto group-scroll" id={`defgroup-${defgroups.id}`}>
                    {defgroups.items?.map((item) => (
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

const ShowEditGroupForm = ({ group, closeEditGroupForm, replayEditGroupFrom, categories }) => {
    const { register, handleSubmit, formState} = useForm({
        defaultValues: {
            name: group.name
        }
    });
    const updateGroup = (data) => {
        chrome.storage.local.get("token", ({token}) => {
            fetch(`https://wet-saver-production.up.railway.app/api/groups/${group.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                closeEditGroupForm();
                replayEditGroupFrom(data.group);
                console.log('JSON parsed:', data.group.name);
            });
        });
        console.log('fast:', data);
    }

    return (
        <>
            <form onSubmit={handleSubmit((updateGroup))} className="created-div p-3 border bg-light rounded">
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className="form-control" name="name" placeholder="Group name" {...register('name')}/>
                </div>
                
                <div className="mb-3">
                    <label className="form-label">State:</label>
                    <select className="form-select" name="state" {...register('state')}>
                        <option value="1" selected={group.state == 1 ? true : false}>Public</option>
                        <option value="0" selected={group.state == 0 ? true : false}>Private</option>
                    </select>
                </div>

                <div className="mb-3">
                    <label className="form-label">Categories</label>
                    <select className="form-select category-select" name="category_id" {...register('category_id')}>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id} selected={cat.id === group.category_id ? true : false}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-success m-2 update-group-btn">Update</button>
                <button type="button" className="close-div btn btn-danger m-2" onClick={() => closeEditGroupForm()}>Закрити</button>
            </form>
        </>);
}

const CreateGroup = ({ closeCreateGroupForm }) => {
    const {register, handleSubmit, formState} = useForm();

    const newGroup = (data) => {
        console.log('new group data: ', data);
    }

    return (
    <>
        <form onSubmit={handleSubmit((newGroup))} className="created-div p-3 border bg-light rounded" style={{maxWidth: "400px", margin:"20px auto"}}>
            <div className="mb-3">
                <label className="form-label">Name</label>
                <input type="text" className="form-control" name="name" {...register('name')} placeholder="Group name" />
            </div>
            
            <div className="mb-3">
                <label className="form-label">State:</label>
                <select className="form-select" name="state" {...register('state')}>
                    <option value="1">Public</option>
                    <option value="0">Private</option>
                </select>
            </div>

            <div className="mb-3">
                <label className="form-label">Categories</label>
                <select className="form-select category-select" name="category_id" {...register('category_id')}><option value="3">EX</option></select>
            </div>

            <button type="submit" className="create btn btn-success m-2 create-group">Create</button>
            <button type="button" className="close-div btn btn-danger m-2" onClick={() => closeCreateGroupForm()}>Закрити</button>
        </form>
    </>
    );
}

class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            showCreateGroupForm: false,
            categories: [],
            typeOfGroup: null,
            showDefItemForm: false,
            showEditGroupForm: false,
            selectedGroup: [],
            selectDefId: null,
            selectedItem: [],
            expandedId: null,
            groups: [],
            defgroups: [],
            users: [],
            loading: true,
            error: null,
            dropdown: [],
            token: null,
            items: []
        }
    }

    componentDidMount() {
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
                defgroups: data.default_groups
            })
        })
        // CATEGORIES
        fetch("https://wet-saver-production.up.railway.app/categories")
        .then(res => res.json())
        .then(data => {
            this.setState({
                categories: data
            });
            console.log('categories are loaded: ', data);
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

    //DELETE GROUP
    DeleteGroup = (groupId) => {
        if(!confirm('Ви точно хочете видалити цю group?')) return;
        console.log('deleted');
        const token = this.state.token;

        fetch(`https://wet-saver-production.up.railway.app/api/groups/${groupId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            if(data.success){
                console.log(`Item ${groupId} deleted in DB`);

                //delete group from cash
                console.log('con>group>deleted: ', window.groupItemsCache);

            } else {
                alert('Помилка при видаленні: ' + data.message);
            }
        })
        .catch(err => console.error(err));
    }

    loadDefGroupItems = (typeOfGroup, defgroupId) => {
        console.log('id: ', defgroupId);
        console.log('typeOfGroup: ', typeOfGroup);
        const token = this.state.token;
        console.log('tok: ', token);
        fetch(`https://wet-saver-production.up.railway.app/api/${typeOfGroup === "defgroups" ? "defgroups" : (typeOfGroup === "groups" ? "groups" : "")}/${defgroupId}/items`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(data => {
            this.UpdateDefItems(typeOfGroup, data);
            console.log('data: ', data);
            
        })
        .catch(err => {
            console.error(err)
            this.closeCreateForm();
        });
    }

    ShowItemBody = (item) => {
        console.log("fdad", item);
        this.setState({
            selectedItem: item
        });
        
        console.log("is", this.state.selectedItem);
    }

    openEditGroupForm = (group) => {
        this.setState({
            showEditGroupForm: true,
            selectedGroup: group
        });
    }

    closeEditGroupForm = () => {
        this.setState({
            showEditGroupForm: false,
            selectedGroup: null
        });
    }

    replayEditGroupFrom = (group) => {
        this.setState(prevState => ({
            groups: prevState.groups.map(g =>
              g.id === group.id ? 
              { ...g, 
                name: group.name, 
                category_id: group.category_id, 
                state: group.state } : g
            )
          }));
    }

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

    openCreateForm = (typeOfGroup, id) => {
        this.setState({
            showDefItemForm: true,
            selectDefId: id,
            typeOfGroup: typeOfGroup
        })
        console.log('opened');
    }

    UpdateDefItems = (typeOfGroup, items) => {
        console.log('itemsss:', items);
        this.setState(prevState => ({
            [typeOfGroup]: prevState[typeOfGroup].map(group => 
                group.id === this.state.selectDefId
                ? {...group, items: items.items} : group
            )
        }));
        this.closeCreateForm();
        console.log('Updated', this.state.groups);
    }

    closeCreateForm = () => {
        this.setState({
            showDefItemForm: false,
            selectDefId: null,
            typeOfGroup: null
        })
        console.log('closed');
    }

    deleteItem = (item, token) => {
        const groupId = item.default_group_id ?? item.group_id;
        const typeOfGroup = item.default_group_id ? 'defgroups' : 'groups';

        fetch(`https://wet-saver-production.up.railway.app/api/items/${item.id}`,  {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        })
        .then(data => {
            console.log('deleted: ', data);
        })
        .then(() => {
            this.setState(prevState => ({
                [typeOfGroup]: prevState[typeOfGroup].map(group => 
                    group.id === groupId
                    ? {
                        ...group,
                        items: group.items.filter(i => i.id !== item.id)
                    } : group
                )
            }))
        this.selectedItemClose();
        })
        .catch(err => {
            console.error('DELETE ERROR:', err);
        });
    }

    opneCreateGroupForm = () => {
        this.setState({
            showCreateGroupForm: true
        })
    }

    closeCreateGroupForm = () => {
        this.setState({
            showCreateGroupForm: false
        })
    }
   
    render() {
        const { groups, defgroups, users, loading, error, token } = this.state

        console.log('groups', groups);
        return (
            <>
                <main className="overflow-auto" style={{ maxHeight: "450px" }}>
                    <h2>Home</h2>

                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}

                    <div className="default_group">
                        <div className="main-container">
                                {console.log('def: ', defgroups)}
                                {defgroups.map((defg) => (
                                    <ShowDefGroup
                                        key={defg.id}
                                        defgroups={defg}
                                        expandedId={this.state.expandedId}
                                        ShowItemBody={this.ShowItemBody}
                                        toggleCard={this.toggleCard}
                                        openCreateForm={this.openCreateForm}
                                        token={token}
                                        typeOfGroup="defgroups"
                                    />
                                ))}
                        </div>
                    </div>

                    <div className="groups">
                        <div className="main-container mt-3">
                            {groups.map((group) => (
                                <ShowGroup
                                    key={group.id}
                                    group={group}
                                    expandedId={this.state.expandedId}
                                    ShowItemBody={this.ShowItemBody}
                                    toggleCard={this.toggleCard}
                                    openCreateForm={this.openCreateForm}
                                    DeleteGroup={this.DeleteGroup}
                                    openEditGroupForm={this.openEditGroupForm}
                                    typeOfGroup="groups"
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
                                                    <button className="btn btn-danger delete-btn" onClick={() => this.deleteItem(this.state.selectedItem, this.state.token)}>Delete</button>
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
                        // UpdateDefItems={this.UpdateDefItems}
                        loadDefGroupItems={this.loadDefGroupItems}
                        token={token}
                        items={this.state.items}
                        typeOfGroup={this.state.typeOfGroup}
                    />
                )}
                {this.state.showEditGroupForm && (
                    <ShowEditGroupForm 
                        group={this.state.selectedGroup}
                        closeEditGroupForm={this.closeEditGroupForm}
                        replayEditGroupFrom={this.replayEditGroupFrom}
                        categories={this.state.categories}
                    />
                )}
                <button className="btn btn-primary btnCreateGroup" onClick={() => this.opneCreateGroupForm()}>+</button>
                {this.state.showCreateGroupForm && (
                    <CreateGroup 
                        closeCreateGroupForm={this.closeCreateGroupForm}
                    />
                )}
            </>
        )
    }
}

export default Home