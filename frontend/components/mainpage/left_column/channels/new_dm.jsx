import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  createSubscription,
  createChannel,
  requestAllChannelsOfUser,
} from '../../../../actions/channels_actions';
import {
  requestAllUsersOfChannel,
} from '../../../../actions/users_actions';
import selector from '../../../../util/selector';
import { merge } from 'lodash';

class NewDm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      description: 'Direct Message',
      kind: 'dm',
      members: [this.props.currentUser],
      other: [],
      created_channel: null,
      privateColor: 'black'
    };


    if (this.props.toUser) {
      this.state.members = [this.props.currentUser, this.props.toUser];
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.addMember = this.addMember.bind(this);
    this.removeMember = this.removeMember.bind(this);
    this.setName = this.setName.bind(this);
  }

  setName() {
    const dmName = [];
    const members = this.state.members;

    this.state.members.forEach(member => {
      dmName.push(member.username);
    });

    let joinedName = dmName.join(", ");
    return joinedName;
  }

  handleSubmit(e) {
    e.preventDefault();
    this.state.name = this.setName();
    this.props.createChannel(this.state)
      .then(channel => {
        this.props.closeModal();
        // this.props.requestAllUsersOfChannel(channel.id);
        this.props.history.push(`/main/${channel.channel.id}`);});
      // .then(() => this.props.closeModal());
  }

  addMember(member, members) {
    return () => {
      let new_members = members.concat(member);
      this.setState({members: new_members});
    };
  }

  removeMember(member, members) {
    return () => {
      if (member !== this.props.currentUser) {
        let member_index = members.indexOf(member);
        members.splice(member_index, 1);
        this.setState({members: members});
      }
    };
  }

  componentWillUnmount() {
    this.props.requestAllChannelsOfUser(this.props.currentUser.id);
  }

  render() {
    const allUsers = selector(this.props.allUsers);
    allUsers.splice((this.props.currentUser.id - 1), 1);

    const otherUsers = allUsers;
    const membersIds = this.state.members.map(member => member.id);

    return(
      <div className="create-channel-container">
        <ul className="create-channel-heading">
          <li>
            <i
              onClick={this.props.closeModal}
              className="fa fa-times-circle exit-create-channel"
              aria-hidden="true">
            </i>
          </li>
          <li className="create-your-channel">DIRECT MESSAGE</li>
        </ul>
          <li className='userslist-headings'>Between:</li>
          <ul className="create-channel-userslist current-user-nullify-cursor">
            {this.state.members.map( user =>
                <li
                  onClick={this.removeMember(user, this.state.members)}
                  key={user.id}>
                  <img src={user.image_url}/>
                  {user.username}
                </li>
              )}
          </ul>
          <li className='userslist-headings'>Available Users:</li>
          <ul className="create-channel-userslist">
            {
              otherUsers.map( user => {
                if (!membersIds.includes(user.id)) {
                    return (
                      <li
                      onClick={this.addMember(user, this.state.members)}
                      key={user.id}>
                      <img src={user.image_url}/>
                      {user.username}
                      </li>
                    )}})}
          </ul>
          <button
            id="button"
            className="create-new-channel-button"
            onClick={this.handleSubmit}>Message
          </button>
          <ul>
            {this.props.channelErrors.map((error, idx) =>
              <li className="error-messages" key={idx}>{error}</li>)}
          </ul>
      </div>
    );}
}

const mapStateToProps = state => {
  return {
    allUsers: state.allUsers,
    currentUser: state.session.currentUser,
    channelErrors: state.channels.errors,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createSubscription: (user_id, channel_id) =>
      dispatch(createSubscription(user_id, channel_id)),
    createChannel: channelData =>
      dispatch(createChannel(channelData)),
    requestAllChannelsOfUser: user_id =>
      dispatch(requestAllChannelsOfUser(user_id)),
    requestAllUsersOfChannel: channel_id =>
      dispatch(requestAllUsersOfChannel(channel_id)),
  }
}

export default withRouter(connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewDm)
)
