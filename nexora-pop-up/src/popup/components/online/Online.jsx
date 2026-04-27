import React from 'react'
import '../../css/auth.css'

import Header from '../header'

class ShowGroup extends React.Component {
    render() {
        const { group, me, expandedId, toggleCard, ShowItemBody, switchToOpenProfile } = this.props;
        console.log('check:', group);
        // const conEdit = group.users.pivot.role == 0 || group.users.pivot.role == null;
        const conEdit = group.users.some(u => u.pivot && Number(u.id) === Number(me.id) && (u.pivot.role === 0 || u.pivot.role === null));

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
                                        <a className="nav-link" onClick={switchToOpenProfile}>Profile</a>
                                    </li>
                                </ul>
                                :
                                <ul className="dropdown-menu">
                                    <li className="nav-item">
                                        <a className="nav-link" onClick={switchToOpenProfile}>Profile</a>
                                    </li>
                                    <li className="nav-item">
                                        <button type="submit" className="follow-btn-group nav-link">Follow Group</button>
                                    </li>
                                    <li className="nav-item">
                                        <button className='nav-link'>Copy group</button>
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

class Online extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            me: [],
            users: [],
            groups: [],
            loading: true,
            error: null,
            selectedItem: [],
            expandedId: null
        }
    }

    componentDidMount() {
        chrome.storage.local.get("token", ({token}) => {
            if (!token) {
                console.log('[NO TOKEN]');
                return;
            } else {
                console.log('[TOKEN]', token);
            }

            
            fetch("https://wet-saver-production.up.railway.app/api/online/group", {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log('Online JSON: ', data)
                this.setState({
                    groups: data.groups,
                    me: data.me
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

    render() {
        const{groups, me, loading, error} = this.state;

        console.log('group checker: ', groups);
        // const conEdit = group.pivot.role == 0 || group.pivot.role == null;

        return (
            <>
                <main className="overflow-auto" style={{ maxHeight: "450px" }}>
                    <h2>Online</h2>

                    {loading && <p>Loading...</p>}
                    {error && <p>{error}</p>}

                    <div className="groups">
                        <div className="main-container mt-4">
                            {groups.map((group) => (
                                <>
                                    <ShowGroup
                                        key={group.id}
                                        group={group}
                                        me={me}
                                        expandedId={this.state.expandedId}
                                        ShowItemBody={this.ShowItemBody}
                                        toggleCard={this.toggleCard}
                                        switchToOpenProfile={this.props.switchToOpenProfile}
                                    />
                                </>
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
                                                </div>
                                            </>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}
                </main>
            </>
    )}
}

export default Online