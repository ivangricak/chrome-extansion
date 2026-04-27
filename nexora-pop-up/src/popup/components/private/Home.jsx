import React, { useState } from 'react'
import '../../css/auth.css'
import '../../css/main.css'
import { useForm } from 'react-hook-form';
import Header from '../header'

class ShowGroup extends React.Component {
    render() {
        const { group, expandedId, ShowItemBody, toggleCard, typeOfGroup, DeleteGroup, OpenForms } = this.props;
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
                                            <button className="update-item nav-link" onClick={() => OpenForms("EditGroup", null, group)}>edit group</button>
                                        </li>
                                        <li className="nav-item">
                                            <button type="submit" onClick={() => OpenForms("CreateItem", typeOfGroup, group.id)} className="create-item nav-link">create item</button>
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
        const { id, CloseForms, token, loadDefGroupItems, typeOfGroup} = this.props;
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
                    CloseForms("CloseCreateItem");
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
                <button type="button" onClick={() => CloseForms("CloseCreateItem")} className="close-div btn btn-danger m-2">Закрити</button>
            </form>
        )
    }
}

class ShowDefGroup extends React.Component {
    
    render () {
        const { defgroups, expandedId, ShowItemBody, toggleCard, items, typeOfGroup, OpenForms} = this.props;

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
                            <li className="nav-item"><button type="submit" className="def-create-item nav-link" onClick={() => OpenForms("CreateItem", typeOfGroup, defgroups.id)}>create item</button></li>
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

const ShowEditGroupForm = ({ group, CloseForms, LoadData, categories }) => {
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
                CloseForms("CloseEditGroup");
                LoadData("LoadEditGroup", null, data.group);
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
                <button type="button" className="close-div btn btn-danger m-2" onClick={() => CloseForms("CloseEditGroup")}>Закрити</button>
            </form>
        </>);
}

const CreateGroup = ({ groups, CloseForms, LoadData }) => {
    const {register, handleSubmit, formState} = useForm();

    const newGroup = (data) => {
        chrome.storage.local.get("token", ({token}) => {
            fetch(`https://wet-saver-production.up.railway.app/api/group/create`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(data => {
                console.log('res: ', data);
                CloseForms("CloseCreateGroup");
                LoadData("LoadGroup", null, data.group);
            })
            .catch(err => {
                console.error('Error:', err);
            });
        });
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
            <button type="button" className="close-div btn btn-danger m-2" onClick={() => CloseForms("CloseCreateGroup")}>Закрити</button>
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
                this.setState( prevState => ({
                    groups: prevState.groups.filter(g => g.id !== groupId)
                }));
            } else {
                alert('Помилка при видаленні: ' + data.message);
            }
        })
        .catch(err => console.error(err));
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
        this.CloseForms("CloseSelItem");
        })
        .catch(err => {
            console.error('DELETE ERROR:', err);
        });
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
            this.LoadData("LoadItem", typeOfGroup, data);
        })
        .catch(err => {
            console.error(err)
            this.CloseForms("CloseCreateItem");
        });
    }

    ShowItemBody = (item) => {
        console.log("fdad", item);
        this.setState({
            selectedItem: item
        });
        
        console.log("is", this.state.selectedItem);
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

    OpenForms = (key, type, value) => {
        { key === "CreateGroup" && this.setState({ showCreateGroupForm: true }) }
        { key === "EditGroup" && this.setState({ showEditGroupForm: true, selectedGroup: value }) }
        { key === "CreateItem" && this.setState({ showDefItemForm: true, selectDefId: value, typeOfGroup: type }) }
    }

    CloseForms = (key) => {
        { key === "CloseCreateGroup" && this.setState({ showCreateGroupForm: false }) }
        { key === "CloseEditGroup" &&  this.setState({ showEditGroupForm: false, selectDefId: null }) }
        { key === "CloseCreateItem" && this.setState({ showDefItemForm: false, selectDefId: null, typeOfGroup: null}) }
        { key === "CloseSelItem" && this.setState({ selectedItem: false, expandedId: null }) }
    }

    LoadData = (key, type, value) => {
        { key === "LoadGroup" &&  this.setState(prevState => ({ groups: [...prevState.groups, value] })) }
        { key === "LoadItem" &&  this.setState(prevState => ({ [type]: prevState[type].map(group => group.id === this.state.selectDefId ? {...group, items: value.items} : group) })); this.CloseForms("CloseCreateItem");}
        { key === "LoadEditGroup" && this.setState(prevState => ({ groups: prevState.groups.map(g => g.id === value.id ? { ...g, name: value.name, category_id: value.category_id, state: value.state } : g ) })) }
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
                                        OpenForms={this.OpenForms}
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
                                    OpenForms={this.OpenForms}
                                    DeleteGroup={this.DeleteGroup}
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
                                        <button type="button" className="btn-close" onClick={() => this.CloseForms("CloseSelItem")}></button>
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
                        CloseForms={this.CloseForms}
                        loadDefGroupItems={this.loadDefGroupItems}
                        token={token}
                        items={this.state.items}
                        typeOfGroup={this.state.typeOfGroup}
                    />
                )}
                {this.state.showEditGroupForm && (
                    <ShowEditGroupForm 
                        group={this.state.selectedGroup}
                        CloseForms={this.CloseForms}
                        LoadData={this.LoadData}
                        categories={this.state.categories}
                    />
                )}
                <button className="btn btn-primary btnCreateGroup" onClick={() => this.OpenForms("CreateGroup")}>+</button>
                {this.state.showCreateGroupForm && (
                    <CreateGroup 
                        CloseForms={this.CloseForms}
                        LoadData={this.LoadData}
                        groups={this.state.groups}
                    />
                )}
            </>
        )
    }
}

export default Home