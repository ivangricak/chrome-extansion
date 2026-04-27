import React from 'react'
import '../../../css/auth.css'



class Profile extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            FollowersCount: null,
            FollowingCount: null,
            GroupsCount: null,
            isFollowing: false,
            user: []
        }
    }

    componentDidMount() {
        chrome.storage.local.get(["token", "userId"], ({token, userId}) => {
            console.log('look user: ', userId);
            fetch(`https://wet-saver-production.up.railway.app/api/online/profile/${userId.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            })
            .then(res => res.json())
            .then(data => {
                this.setState({
                    FollowersCount: data.FollowersCount,
                    FollowingCount: data.FollowingCount,
                    GroupsCount: data.GroupsCount,
                    isFollowing: data.isFollowing,
                    user: data.user
                });

                console.log('res:', data);
            });
        });
    }

    render() {
        const { FollowersCount, FollowingCount, GroupsCount, isFollowing, user } = this.state;
        return (
            <>
                <main>
                    <div className="d-flex justify-content-center">
                        <div className="col-10 col-sm-6 col-md-4">
                            <h1 className="profile-name">{user.nick}</h1>
                            <div className="profile-stats">
                                <div>
                                    <h5>{GroupsCount}</h5>
                                    <p>groups</p>
                                </div>
                                <div>
                                    <h5>{FollowersCount}</h5>
                                    <p>Followers</p>
                                </div>
                                <div>
                                    <h5>{FollowingCount}</h5>
                                    <p>following</p>
                                </div>
                            </div>

                            <div id="follow-block">
                                {isFollowing ?  <button id="following-btn" className="following-btn"> Unfollow </button> 
                                : 
                                <button id="follow-btn" className="follow-btn"> Follow </button>}
                            </div>

                            
                            {/* <div className="mb-3 row">
                                <label for="nick" className="col-sm-2 col-form-label">Nick</label>
                                <div className="col-sm-10">
                                    <input type="text" className="form-control" id="nick" name="nick" value="" />
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">UpDate</button>
                            </div> */}
                        </div>
                    </div>
                </main>
            </>
    )}
}

export default Profile