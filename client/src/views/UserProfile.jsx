import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navigation from './Components/NavigationBar.jsx';
import logo from '../Images/Logo.png';
import defaultProfilePic from '../Images/profile-picture.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCrown, faUser, faPenNib, faEnvelope, faPhone, faLocationDot, faPenAlt, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import bgprofile from '../Images/profileBG2.jpg';
import Footer from './Footer.jsx';
import Loader from './Components/Loader.jsx';

function UpdateUsers() {
    const { userId } = useParams();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [loading, setLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const [error, setError] = useState(null);
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:3001/getUser/${userId}`)
            .then(result => {
                setFirstName(result.data.firstName || '');
                setLastName(result.data.lastName || '');
                setEmail(result.data.email || '');
                setPhone(result.data.phone || '');
                setAddress(result.data.address || '');
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to fetch user data');
                setLoading(false);
            });
    }, [userId]);

    useEffect(() => {
        axios.get(`http://localhost:3001/ShowProfilePic/${userId}`)
            .then(response => {
                setProfile(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the profile picture!', error);
                setError('There was an error fetching the profile picture!');
            });
    }, [userId]);

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];
        setImage(selectedFile);
        setPreviewImage(URL.createObjectURL(selectedFile)); // Generate preview URL
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        if (!firstName || !email || !phone || !address) {
            alert('Please fill out all fields');
            return;
        }



        const formData = new FormData();
        formData.append('image', image);
        formData.append('userId', userId);

        axios.post("http://localhost:3001/ProfileImage", formData)
            .then(result => {
                if (result.data.alreadyExists) {
                    return axios.put("http://localhost:3001/ProfileImage", formData);
                }
            })
            .then(() => {
                return axios.put(`http://localhost:3001/updateUser/${userId}`, { firstName, lastName, email, phone, address });
            })
            .then(() => {
                navigate(`/UserHome/${userId}`);
            })
            .catch(err => {
                console.error(err);
                setError('Failed to update user data');
            });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div>
            <Navigation logo={logo} />
            <div
                className=""
                style={{ 
                    backgroundImage: `url(${bgprofile})`, 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center' 
                }}
            >
                <div className="flex justify-center items-center min-h-screen">
                    <div className="w-full sm:w-1/2 bg-custom-light bg-opacity-70 p-6 sm:p-8 rounded-md shadow-md mt-16 mb-40">
                        <form onSubmit={handleUpdate}>
                            <h2 className="text-center text-4xl font-semibold text-white mb-4">Your Profile</h2>
                            <div className="text-center mb-8">
                                <div className="flex items-center justify-center w-30">
                                    <div className="relative w-40 h-40">
                                        <img 
                                            src={previewImage || (profile.image ? `http://localhost:3001/Images/${profile.image}` : defaultProfilePic)} 
                                            alt="Profile" 
                                            className="w-full h-full bg-cover bg-center rounded-full transition-all duration-500 ease-in-out transform hover:scale-110 hover:shadow-2xl"
                                        />
                                        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 flex items-center justify-center">
                                            <input 
                                                type="file" 
                                                id="imageUpload" 
                                                accept=".png, .jpg, .jpeg" 
                                                onChange={handleImageChange}
                                                className="hidden" 
                                            />
                                            <label 
                                                htmlFor="imageUpload" 
                                                className="flex items-center justify-center"
                                            >
                                                <FontAwesomeIcon 
                                                    icon={faPenAlt} 
                                                    className="text-black text-[1rem] bg-white p-2 rounded-full hover:bg-blue-500 mb-10 transition-all duration-300 ease-in-out transform hover:scale-105 hover:text-white" 
                                                />
                                            </label>
                                        </div>
                                    </div>
                                </div>
                                <h1 className="text-4xl font-thin text-white mt-6 mb-2">
                                    <span className='flex justify-center items-center space-x-1'>
                                        {firstName} {lastName}
                                    </span>
                                    <small className="font-bold text-orange-300 text-xl mt-2 flex items-center justify-center">
                                        <FontAwesomeIcon icon={faCrown} className="text-orange-300 mr-2" />
                                        Premium
                                    </small>
                                </h1>
                            </div>

                            <div className="flex gap-4 mb-4">
                                <div className="flex-1">
                                    <label className="block text-xl text-gray-100 font-thin mb-3">First Name</label>
                                    <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                        <FontAwesomeIcon icon={faUser} className="w-4 h-4 ml-4 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Enter your first name"
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                <div className="flex-1">
                                    <label className="block text-xl text-gray-100 font-thin mb-3">Last Name</label>
                                    <div className="flex items-center rounded-lg h-12 bg-white transition-all duration-300 ease-in-out transform hover:scale-105 focus-within:border-black">
                                        <FontAwesomeIcon icon={faPenNib} className="w-4 h-4 ml-4 text-black" />
                                        <input
                                            type="text"
                                            placeholder="Enter your last name"
                                            className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4 mt-3">
                                <label className="block text-xl text-gray-100 font-thin mb-3">E-mail</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition duration-200 ease-in-out focus-within:border-black">
                                    <FontAwesomeIcon icon={faEnvelope} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="email"
                                        placeholder="Enter your email"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                        value={email}
                                        readOnly
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-xl text-gray-100 font-thin mb-3">Phone Number</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition duration-200 ease-in-out focus-within:border-black">
                                    <FontAwesomeIcon icon={faPhone} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Enter your phone number"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <label className="block text-xl text-gray-100 font-thin mb-3">Address</label>
                                <div className="flex items-center rounded-lg h-12 bg-white transition duration-200 ease-in-out focus-within:border-black">
                                    <FontAwesomeIcon icon={faLocationDot} className="w-4 h-4 ml-4 text-black" />
                                    <input
                                        type="text"
                                        placeholder="Enter your address"
                                        className="ml-3 w-full h-full font-thin bg-white text-black border-none rounded-lg focus:outline-none placeholder-black"
                                        value={address}
                                        onChange={(e) => setAddress(e.target.value)}
                                    />
                                </div>
                            </div>.

                            <div className="text-center">
                            <button
                                type="submit"
                                className={`py-2 px-8 rounded-lg transition-all duration-300 ease-in-out transform ${
                                    loading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-white text-black hover:bg-black hover:text-white hover:scale-105'
                                }`}
                                disabled={loading}
                                >
                                {loading ? (
                                    <FontAwesomeIcon icon={faCircleNotch} spin className="w-5 h-5" />
                                ) : (
                                    'Save Changes'
                                )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default UpdateUsers;
