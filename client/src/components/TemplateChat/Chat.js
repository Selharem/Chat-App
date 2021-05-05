import React, { useState, useEffect,useLayoutEffect,useRef } from "react";
import queryString from 'query-string';
import io from "socket.io-client";
import ReactEmoji from 'react-emoji';
import { Link } from 'react-router-dom';
import './Chat.css';


const ENDPOINT = 'localhost:5000';

let socket;


function Chat({ location }) {

	const [name, setName] = useState('');
	const [room, setRoom] = useState('');
	const [message, setMessage] = useState('');
	const [messages, setMessages] = useState([]);
	const [messagesDB, setMessagesDB] = useState([]);
	const [friends, setFriends] = useState([]);
	const [postId, setPostId] = useState(null);
	const [firstClick, setFirstClick] = useState(true);
	const [displayAside, setDisplayAside] = useState({display:'block'});
	const [displayMain, setDisplayMain] = useState({ display: 'none' });
	const time = new Date();
	const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });
	

	useEffect(() => {
		
			//Fetch Friends
			fetch(`http://localhost:5000/friends/${nom}`)
				.then(res => res.json())
				.then(friend => setFriends(friend[0].Friends , console.log(`Friends feched ...`, JSON.stringify(friend[0].Friends ))));
		//console.log(` l message ${messagesDB[[0]]['me'].message1}`);
			
	}, []);


	//Send name and rooom to the server
	//get name of the user how will send the message
	const data = queryString.parse(window.location.search);
	const nom = data.name;




	const clickFreind = (event) => {
		
		//Connenct to the server
		socket = io(ENDPOINT);
		console.log(` list freinds ${JSON.stringify(friends[0].namef)}`);
		console.log(`room ${event.currentTarget.dataset.id}`);
		
	
		setDisplayAside({
			display: 'none'
		});

		setDisplayMain({
			display: 'block'
		})

		setFirstClick(false);

		setMessages([]);
    
		// Get the room == The person who will receive the message
		const { Name, Room } = { Name: nom, Room: event.currentTarget.dataset.id }
		setName(nom);
		setRoom(event.currentTarget.dataset.id);
		socket.emit('join', { Name, Room }, (error) => {
			if (error) {
				alert(error);
			}

			console.log(socket);
			
		});


		//Fetch Messages DB
		fetch(`http://localhost:5000/messages/${event.currentTarget.dataset.id}`)
			.then(res => res.json())
			.then(message => setMessagesDB(message));


		//Get messages reel time
		socket.on('message', message => {
			setMessages(messages => [...messages, message]);
			console.log(message)
			
		});
	
		
	}

	//Sending messages
	const sendMessage = (event) => {
		event.preventDefault();
		//Socket
		if (message) {
			socket.emit('sendMessage', message, () => setMessage(''));

			//send msg to the Database
			const requestOptions = {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					"Room":room,
					"user": name,
					"message1": message,
					"date": formattedTime
				})
			};
			fetch(`http://localhost:5000/insert/messages/sender`, requestOptions)
				.then(response => response.json())
				.then(data => setPostId(data.id));
		}
		
	}

	return (
		<div id="container">
			<div className="container2">
				<aside >
					<header>
						<input type="text" placeholder="search"></input>
					</header>
					<ul >
						{friends.map((friend, i) =>
							<li
							key={i}
								data-id={friend.room}
								onClick={clickFreind}
							>
							<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt=""></img>
							<div>
									<h2 id="test" >{friend.namef}</h2>
								<h3>
									<span className="status orange"></span>
									offline
								</h3>
							</div>
							</li>
						)}
					</ul>
				</aside>
				<main style={displayMain}>
					<header>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/chat_avatar_01.jpg" alt=""></img>
						<div>
							<h2>{room}</h2>
							<h3>already 1902 messages</h3>
						</div>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_star.png" alt=""></img>
					</header>
					{firstClick ?
						(
						<ul id="chat">
						{messagesDB.map((message, i) =>
							<li key={i}
								className={message['me'].name === nom ? 'you' : 'me'}>
								<div className="entete">
									<span className="status green"></span>
									<h2 >{message['me'].name}</h2>
									<br/>
									<h3>10:12AM, Today</h3>
								</div>
								<div className="triangle"></div>
								<div className="message">{ReactEmoji.emojify(message['me'].message1)}</div>
							</li>
						)}
					</ul>
						)
						:
						(
							<ul id="chat">
								{messagesDB.map((message, i) =>
									<li key={i}
										className={message['me'].name===nom ? 'you' : 'me'}>
										<div className="entete">
											<span className="status green"></span>
											<h2>{message['me'].name}</h2>
											<br/>
											<h3>{message['me'].date}</h3>
										</div>
										<div className="triangle"></div>
										<div className="message">{ReactEmoji.emojify(message['me'].message1)}</div>
									</li>
								)}
								{messages.map((message, i) =>
									<li key={i}
										className={message.user === nom ? 'you' : 'me'}>
										<div className="entete">
											<span className="status green"></span>
											<h2>{message.user}</h2>
											<br/>
											<h3>{formattedTime}</h3>
										</div>
										<div className="triangle"></div>
										<div className="message">{ReactEmoji.emojify(message.text)}</div>
									</li>
								)}
							</ul>
						)}
					<footer>
						<textarea placeholder="Type your message..."
							type="text"
							value={message}
							onChange={(event) => setMessage(event.target.value)}
							onKeyPress={event => event.key === 'Enter' ? sendMessage(event) : null}>
						</textarea>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_picture.png" alt=""></img>
						<img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/1940306/ico_file.png" alt=""></img>
						<Link   onClick={sendMessage}>SEND</Link>
					</footer>
				</main>

			</div>
		</div>
	);
}

export default Chat;
