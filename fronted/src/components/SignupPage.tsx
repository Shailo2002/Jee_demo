import React, { useState } from 'react';
import styled from 'styled-components';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`;

const LoginCard = styled.div`
  background: white;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
`;

const Title = styled.h1`
  text-align: center;
  color: #1a1a1a;
  margin-bottom: 8px;
`;

const SubText = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 24px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0 20px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
`;

const SignInButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #1a73e8;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #1557b0;
  }
`;

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle signup logic here
    console.log({ email, password, confirmPassword, name });
  };

  return (
    <LoginContainer>
      <LoginCard>
        <form onSubmit={handleSubmit}>
          <Title>Create your account</Title>
          <SubText>Or <a href="/login" style={{ color: '#1a73e8', textDecoration: 'none' }}>sign in to existing account</a></SubText>
          
          <label>Full Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Email address</label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label>Confirm Password</label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <SignInButton type="submit">Create Account</SignInButton>
        </form>
      </LoginCard>
    </LoginContainer>
  );
};

export default SignupPage; 