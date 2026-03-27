import React from 'react'
import '../../css/auth.css'
import '../../css/main.css'
import Header from '../header'

class Home extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            selectedItem: [],
            expandedId: null,
            groups: [],
            defgroup: [],
            users: [],
            loading: true,
            error: null
        }
    }

    componentDidMount() {
        // chrome.storage.local.remove("token")
        chrome.storage.local.get("token", ({token}) => {
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
   
    render() {
        const { groups, defgroup, users, loading, error } = this.state

        console.log(groups);
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
                                        <div className={`card ${this.state.expandedId === defg.id ? 'expanded' : ''}`} onClick={(e) => this.toggleCard(e, defg.id)} id="card" key={defg.id}>
                                            <div className="title-row">
                                                <h5 className="mb-3">{defg.name}</h5>
                                                <div className="dropdown">
                                                    <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                        <i className="bi bi-three-dots-vertical"></i>
                                                    </button>
                                                    <ul className="dropdown-menu">
                                                        <li><button type="submit" className="def-create-item">create item</button></li>
                                                    </ul>
                                                </div>
                                            </div>
                                            <div className="scroll overflow-auto group-scroll">
                                                {defg.items.map((item) => (
                                                    <div className="item-copy" key={item.id}>
                                                        <div className="item" onClick={() => this.ShowItemBody(item)} id='item'>
                                                            <span className="tag">{item.tag || ' '}</span>
                                                            <span>{item.name}</span>
                                                        </div>
                                                        <button className="copy" type="button">copy</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                ))}
                        </div>
                    </div>

                    <div className="groups">
                        <div className="main-container mt-4">
                            {groups.map((group) => (
                                <>
                                    <div className={`card ${this.state.expandedId === group.id ? 'expanded' : ''}`} onClick={(e) => this.toggleCard(e, group.id)} id="card" key={group.id}>
                                        <div className="title-row">
                                            <h5 className="group-title">{group.name}</h5>
                                            <div className="dropdown">
                                                <button type="button" className="btn" data-bs-toggle="dropdown" aria-expanded="false">
                                                    <i className="bi bi-three-dots-vertical"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <div className="scroll overflow-auto group-scroll">
                                            {group.items.map((item) => (
                                                <div className="item-copy" id="item-copy" key={item.id}>
                                                    <div className="item" onClick={() => this.ShowItemBody(item)} id='item'>
                                                        <span className="tag">{item.tag || ' '}</span>
                                                        <span className='item-name'>{item.name}</span>
                                                    </div>
                                                    <button className="copy" data-link={item.link} type="button">copy</button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
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
            </>
        )
    }
}

export default Home