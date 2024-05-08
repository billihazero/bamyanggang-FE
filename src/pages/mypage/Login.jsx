import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    // const [userId, setUserId] = useState('')
    const [credentials, setCredentials] = useState({ userId: '', userPw: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // console.log(userId);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials({ ...credentials, [name]: value });
     //   setUserId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:80/login', credentials , 
               
                );
                
                if (response.status === 200) {
                    
                    const access = response?.headers['authorization']; // JWT 토큰 받기
                    console.log(response.headers);
                    console.log(access);
                    localStorage.setItem('access', access); // 토큰을 로컬 스토리지에 저장
                    
                    const userInfoResponse = await axios.get(`http://localhost:80/userInfo/${credentials.userId}`);
                    console.log(userInfoResponse);
                    const userData = userInfoResponse.data; // 서버에서 받은 사용자 데이터
                    localStorage.setItem('user', JSON.stringify(userData));
              
                    alert('로그인 성공');
                    navigate('/', { state: { user: userData } }); // MyPage로 리다이렉션
                    return; // 성공 시 함수 종료
                }
            
            // 에러 처리
            setError('로그인 실패: 아이디 또는 비밀번호가 일치하지 않습니다.');
        } catch (error) {
            console.error('로그인 처리 중 에러 발생:', error);
            setError('로그인 처리 중 문제가 발생했습니다.');
        }
    };
    return (
        <div className="login-container">
            <form onSubmit={handleSubmit}>
                <h1>로그인</h1>
                <div>
                    {/* <label htmlFor="userId">아이디</label> */}
                    <input className='text'
                        type="text"
                        name="userId"
                        id="userId"
                        placeholder='아이디'
                        value={credentials.userId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    {/* <label htmlFor="userPw">비밀번호</label> */}
                    <input className='text2'
                        type="password"
                        name="userPw"
                        id="userPw"
                        placeholder='비밀번호'
                        value={credentials.userPw}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">로그인</button>
                <button type="button" onClick={() => navigate('/MemberJoin')}>회원가입</button>
                {error && <p className="error">{error}</p>}
            </form>
        </div>
    );
}

export default Login;