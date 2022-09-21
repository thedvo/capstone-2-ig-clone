import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../UserContext';
import { Link } from 'react-router-dom';

import igCloneApi from '../Api';
import SimplePostCard from '../posts/SimplePostCard';

import 'bootstrap/dist/css/bootstrap.min.css';
import Avatar from '@material-ui/core/Avatar';
import './CurrentUserDetail.css';

const CurrentUserDetail = () => {
	const { currentUser } = useContext(UserContext);
	console.log('UserDetail', 'username=', currentUser.username);

	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function getUser() {
			let user = await igCloneApi.getCurrentUser(currentUser.username);

			setUser(user);
			setIsLoading(false);
		}
		getUser();
	}, []);

	if (isLoading) {
		return (
			<p className="Loading fw-bold text-info fs-1 text-center mt-4">
				Loading &hellip;
			</p>
		);
	}

	function noLikes() {
		return (
			<div className="CurrentUser-Likes">
				<h5>
					<span>0</span> Likes
				</h5>
			</div>
		);
	}
	function noFollowers() {
		return (
			<div className="CurrentUser-Followers">
				<h5>
					<span>0</span> Followers
				</h5>
			</div>
		);
	}
	function noFollowing() {
		return (
			<div className="CurrentUser-Following">
				<h5>
					<span>0</span> Following
				</h5>
			</div>
		);
	}

	function hasLikes() {
		return (
			<div className="CurrentUser-Likes">
				<Link
					to={`/users/${user.username}/likes`}
					style={{ textDecoration: 'none' }}
				>
					<h5 className="UserDetail-Title">
						{' '}
						<span className="UserDetail-Number">{user.likes.length}</span> Likes
					</h5>
				</Link>
			</div>
		);
	}
	function hasFollowers() {
		return (
			<div className="CurrentUser-Followers">
				<Link
					to={`/users/${user.username}/followers`}
					style={{ textDecoration: 'none' }}
				>
					<h5 className="UserDetail-Title">
						<span className="UserDetail-Number">{user.followers.length}</span>
						Followers
					</h5>
				</Link>
			</div>
		);
	}
	function hasFollowing() {
		return (
			<div className="CurrentUser-Following">
				<Link
					to={`/users/${user.username}/following`}
					style={{ textDecoration: 'none' }}
				>
					<h5 className="UserDetail-Title">
						<span className="UserDetail-Number">{user.following.length}</span>{' '}
						Following
					</h5>
				</Link>
			</div>
		);
	}

	async function handleDeleteProfile() {
		await igCloneApi.deleteUser(user.username);
	}

	return (
		<div className="UserDetail container col-md-8 offset-md-2 mt-4">
			<div className="row">
				{/* <div className="UserDetail-Header"> */}
				<div className="col">
					<div className="UserDetail-Avatar">
						<Avatar alt={user.username} src={user.profileImage} />
					</div>
				</div>
				<div className="col-10">
					<div className="row">
						<div className="col-2">
							<div className="UserDetail-Username">
								<h4>{user.username}</h4>
							</div>
						</div>
						<div className="UserDetail-Details col-2">
							<div className="UserDetail-EditBtn">
								<Link to={'/edit'}>
									<button className="btn btn-primary">Edit Profile</button>
								</Link>
							</div>
						</div>
						<div className="col-3">
							<div className="UserDetail-DeleteBtn">
								<form onSubmit={handleDeleteProfile}>
									<button className="btn btn-danger">Delete Profile</button>
								</form>
							</div>
						</div>
					</div>
					<div className="row mt-4">
						<div className="col-2">
							{user.likes.length > 0 ? hasLikes() : noLikes()}
						</div>
						<div className="col-2">
							{user.followers.length > 0 ? hasFollowers() : noFollowers()}
						</div>
						<div className="col-2">
							{user.following.length > 0 ? hasFollowing() : noFollowing()}
						</div>
					</div>

					<div className="row mt-2">
						<h5 className="UserDetail-FullName">
							{user.firstName} {user.lastName}
						</h5>
					</div>

					<div className="row">
						<p className="UserDetail-Bio">{user.bio}</p>
					</div>
				</div>
			</div>
			<div className="row mt-5">
				<div className="UserDetail-Posts">
					{/* map out individual post components */}
					{user.posts.length ? (
						<div className="UserDetail-Posts row">
							{user.posts.map((p) => (
								<div className="col-4 mt-3">
									<SimplePostCard id={p.id} imageFile={p.imageFile} />
								</div>
							))}
						</div>
					) : (
						<p className="lead">User currently has no posts.</p>
					)}
				</div>
			</div>
		</div>
	);
};

export default CurrentUserDetail;
