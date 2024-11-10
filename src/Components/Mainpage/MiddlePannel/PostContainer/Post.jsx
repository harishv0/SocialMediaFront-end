import { Avatar } from '@mui/material'
import React, { useEffect, useState, useRef, useReducer } from 'react';
import './PostContainer.css'
import '../UploadSec/UploadSection.css'
import logo from '../../../../Assets/logo.png'
import like from '../../../../Assets/like.png'
import { FaThumbsUp } from "react-icons/fa6";
import { FaRegComment } from "react-icons/fa6";
import { FiThumbsUp } from "react-icons/fi";
import { PiShareFatBold } from "react-icons/pi";
import { IoSend } from "react-icons/io5";
import axiosConfig from '../../../../Api/axiosConfig';
import Cookies from 'js-cookie';
import { toast } from 'react-toastify';
import ReactPlayer from 'react-player';
import SockJS from 'sockjs-client';
import { Client, Stomp } from '@stomp/stompjs';
import { useNavigate, useParams } from 'react-router';
import { IoVolumeMute } from "react-icons/io5";
import { VscUnmute } from "react-icons/vsc";
import { FiSave } from "react-icons/fi";
import { BsFillPauseCircleFill } from "react-icons/bs";
import { FaPlayCircle } from "react-icons/fa";

const Post = ({object}) => {
    
    const [isLike, setIsLike] = useState(false)
    const navigate = useNavigate()
    const [comment, setComment] = useState(false)
    const [PostUser, setPostUser] = useState('')
    const [newComment, setNewComment] = useState('')
    const [post, setPost] = useState('')
    const [currentUser, setcurrentUser] = useState('')
    const [commentUsers, setcommentUsers] = useState([])
    const [stompClient, setStompClient] = useState(null);
    const playerref = useRef(null);
    const [isplaying, setIsPlaying] = useState(false);
    const pressTimeRef = useRef(null);
    const [isMuted, setIsMuted] = useState(true);
    const [volume, setVolume] = useState(false);
    
    const handlePlayButton = () => {
        setIsPlaying(prev => !prev);
    };

    const handleMouseEnter = () => {
        setIsPlaying(true);
    };
    const handleMouseLeave = () => {
        setIsPlaying(false);
    };


    const handleLongPress = () => {
        pressTimeRef.current = setTimeout(() => {
            setIsPlaying(false);
        }, 500);
    };

    const handleTouchEnd = () => {
        clearTimeout(pressTimeRef.current);
        setIsMuted(prev => !prev);
    };


    const handleMuteToggle = () => {
        setIsMuted(prev => !prev);
    };
    const isPostAvailable = (data) => {
        return data === "" ? false : true;
    }

    const handleGetPostById = async() => {
        const response = await axiosConfig.get(`/api/post/getpostbyid/${object?.postId}`);
        setPost(response.data)
        
    }

    const handleCurrentUser = async() =>{
        const response = await axiosConfig.get(`/api/user/getbyid/${Cookies.get('userid')}`)
        setcurrentUser(response.data.data)
    }
    const handlePostUser = async() =>{
        const response = await axiosConfig.get(`/api/user/getbyid/${object?.userId}`)
        setPostUser(response.data.data)
    }

    const handleDateTime = (dateTime) => {
        const currentdate = new Date();
        const providedData = new Date(dateTime);
        
        const timeDifference = currentdate - providedData;

        const seconds = Math.floor(timeDifference / 1000);
        const minutes = Math.floor(timeDifference / (1000 * 60));
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const months = Math.floor(days / 30)
        const years = Math.floor(months / 12)

        if (seconds < 60) {
            return `${seconds}s`;
          } else if (minutes < 60) {
            return `${minutes}min`;
          } else if (hours < 24) {
            return `${hours}h`;
          } else if (days < 30) {
            return `${days}d`;
          } else if (months < 12) {
            return `${months}m`;
          } else {
            return `${years}y`;
          }    
    }

    const handleLike = async() => {
        try {
            const response = await axiosConfig.post(`/api/post/postlike/${Cookies.get('userid')}/${object?.postId}`)
            if(response.data.success){
                object?.likes.push(Cookies.get('userid'))
                setIsLike(response.data.success)
                toast.success(response.data.message, {autoClose:1000})
            }else{
                const index = object.likes.indexOf(Cookies.get('userid'));
                if (index > -1) {
                    object.likes.splice(index, 1);
                }
                setIsLike(response.data.success)
                toast.error(response.data.message, {autoClose:1000})
            }
        } catch (error) {
            setIsLike(error.response.data.success)
            console.log("error");
        }
    }

    const fetchUsersInComment = async() => {
        try {
        const userIds = object?.comment.map(c => c.userId);
        const userFetchPromises = userIds.map(id => axiosConfig.get(`/api/user/getbyid/${id}`));
        const users = await Promise.all(userFetchPromises);
        setcommentUsers(prevUsers => [...prevUsers, ...users.map(user => user.data)]);
        } catch (error) {
            console.error("Error fetching users in comments:", error);
        }
    }
    
    const isVideoOrPhoto = (post) => {
        if(post.includes('jpeg') || post.includes('png') || post.includes('jpg')){
            return "photo";
        }else if(post.includes('mp4') || post.includes('mkv') || post.includes('webm')){
            return "video";
        }
    }

    const handleSendComment = async () => {
        const formData = new FormData()
        try {
            formData.append("postId", object?.postId)
            formData.append("userId", Cookies.get('userid'))
            formData.append("comment", newComment)
            const response = await axiosConfig.post("/api/post/comment", formData,{
                headers:{
                  'Content-Type': 'multipart/form-data'
                }
              });
              setNewComment('')
            //   if (response.data.success) {
            //     // Ensure stompClient is defined before publishing
            //     if (stompClient) {
            //         stompClient.publish({
            //             destination: '/topic/comments',
            //             body: JSON.stringify(commentsData),
            //         });
            //     }
            //     setNewComment('');
            // }
        } catch (error) {
            console.error("Error:", error);
        }
    }

    const handleSavePost = async() => {
        try {
            const response = await axiosConfig.post(`/api/user/savepost/${Cookies.get('userid')}/${object?.postId}`);
            console.log(response);
            toast.info(response.data.message)
        } catch (error) {
            console.error("Error saving post:", error);
            toast.error(error.response.data.message);
        }
        
    }
    

    useEffect(() => {
        if (object?.likes.includes(Cookies.get('userid'))) {
            setIsLike(true); 
        }
    }, []);

    useEffect(()=>{
        handleGetPostById()
        handlePostUser();
        handleCurrentUser();
    }, []);

    useEffect(() => {
        if (post){
            fetchUsersInComment();
        }
    }, [post]); 

    useEffect(() => {
        const sock = new SockJS('http://localhost:8080/ws'); // WebSocket URL
        const stompClient = new Client({
            webSocketFactory: () => sock,
            onConnect: () => {
                stompClient.subscribe('/topic/comments', (message) => {
                    // console.log(message.body);
                    handleGetPostById();
                });
            },
        });
        stompClient.activate();
        setStompClient(stompClient);
    
        return () => {
            stompClient.deactivate();
        };
    }, []);


  return (
    <div className='postcontainer'>
        <div className='post_container'>
            {/* header */}
            <div className='post_header'>
                <Avatar className="post_img" src={PostUser?.profile} onClick={()=>navigate(`/profile/${object?.userId}`)}
                    ></Avatar>
                <div className='post_header-name-time-div'>
                    <p className='post_header_text' onClick={()=>navigate(`/profile/${object?.userId}`)}>{object?.name} </p>
                    <span className='post_header-time'>{handleDateTime(object?.dateTime)} ago</span>
                </div>
            </div>
            {/* description */}
            <div className='post_description'>
                <p className='post_description-p'>{object?.description}</p>
            </div>
            {/* image */}
            <div className='post_image'>
                {
                    isVideoOrPhoto(object?.postUrl) === "photo" ? (
                        isPostAvailable(object?.postUrl) ? <img src={object?.postUrl} className='post_image-img' width="600px" alt='' /> : <span>That post has a problem</span>
                    ):
                    
                    isVideoOrPhoto(object?.postUrl) === "video" ? (
                        <div className='post_image-videos-div'>
                            {
                                isPostAvailable(object?.postUrl) ? 
                                <ReactPlayer
                                    url={object?.postUrl}
                                    className='post_image-videos'
                                    width="100%"    
                                    height="100%"
                                    ref={playerref}
                                    playing={isplaying}
                                    muted={isMuted}
                                    onTouchStart={handleLongPress}
                                    onTouchEnd={handleTouchEnd}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave = {handleMouseLeave}
                                    onClick={handleMuteToggle}
                                />
                                 : <span>That post has a problem</span>
                                
                            }
                            {/* <p className='post_image-videos-play' onClick={handlePlayButton}>
                                {isplaying ? <BsFillPauseCircleFill /> : <FaPlayCircle />}
                            </p> */}
                            <p className='post_image-videos-mute' onClick={handleMuteToggle}>
                                {isMuted ? <IoVolumeMute /> : <VscUnmute />}
                            </p>
                        </div> ) : null
                        
                }
                
                
                
            </div> 
            
            {/* like count */}
            <div className='post_like_container'>
                {object?.likes.length > 0 ? (
                    <>
                        <img className="post_like_img" src={like} alt="like" />
                        <p className='post_like_count'>{object?.likes.length}</p>
                    </>
                ) : null}
                
            </div>
            {/* like and share and comment */}
            <div className='post_like_share'>
                <p className='post_like_button_text' onClick={handleLike}>
                <span className={isLike ? 'like-animate' : ''}>
                    <span>{isLike ? <FaThumbsUp style={{fontSize:'24px', color:'#0866FF'}}/> 
                    : <FiThumbsUp style={{fontSize:'24px',color:'gray'}}/>}</span>
                    </span>
                    <span style={{color: isLike ? '#0866FF' : 'gray', fontWeight:'700'}}>
                    Like
                    </span>
                </p>
                <p className='post_like_button_text'onClick={()=>setComment((prev)=> !prev)}> <span><FaRegComment style={{fontSize:'20px',marginTop:'5px'}} /></span>Comment</p>
                <p className='post_like_button_text' onClick={handleSavePost}><span><FiSave  style={{fontSize:'21px',marginTop:'5px'}} /></span>
                {
                    currentUser?.savepost?.some(savedPost => savedPost.postId === object?.postId) ? "Unsave" : "Save"
                    

                }</p>
            </div>
            {/* comment */}
            {comment ? (
                <div className='upload_comment'>
                    <div className='upload_comment-section'>
                    <div className='upload_comment-section-list'>
                        <ul className='comments-list'>
                            {post?.comment.map((comment, index) => {
                                const user = commentUsers[comment.userId]
                                return (
                                    <li key={index} className='comment-item'>
                                        <>
                                        <Avatar className='comment-avatar' src={comment?.user.profile} />
                                        <div className='comment-content'>
                                            <span className='comment-username'>
                                            {comment?.user.name || "Unknown User"}
                                            <span className='comment-dataTime'>{handleDateTime(comment?.dateTime)} ago</span>
                                            </span>
                                            
                                            <p className='comment-text'>{comment.comment}</p>
                                        </div>
                                        </>
                                    </li>
                                )
                                
                            })}
                        </ul>
                    </div>
                        <div className='upload_comment-section-div'>
                            <Avatar className='upload_comment-section-div-avatar' src={currentUser?.profile}></Avatar>
                            <div className='upload_comment-section-div-input-wrapper'>
                                <input className='upload_comment-section-div-input' value={newComment} type="text" onChange={(e)=> setNewComment(e.target.value)} placeholder="Write a Comment"/>
                                <button className='upload_comment-section-div-post' onClick={handleSendComment}><IoSend /></button>
                            </div>
                        </div> 
                    </div> 
                </div> ) : null
            }


        </div>
    </div>
  )
}

export default Post
