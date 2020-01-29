import React from 'react'
import styled from 'styled-components'

const HeaderOuter = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.spacing([0, 1])};
  height: ${({ theme }) => theme.spacing(8)};
  align-items: center;
  justify-content: space-between;
`

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  margin: ${({ theme }) => theme.spacing(1)};
  ${({ theme }) => theme.text('body', 'medium')};
  color: ${({ theme }) => theme.color('contrast', 1)};
`

const Logo = styled.img`
  height: 48px;
  display: block;
  margin-right: ${({ theme }) => theme.spacing(2)};
`

const NavTray = styled.nav`
  display: flex;
  margin: ${({ theme }) => theme.spacing(2)};
  ${({ theme }) => theme.text('body', 'large')};
  color: ${({ theme }) => theme.color('text', 2)};
  font-weight: 600;
`

const NavLink = styled.a`
  display: block;
  white-space: nowrap;
  margin: ${({ theme }) => theme.spacing([0, 2])};
`

function Header() {
  return (
    <HeaderOuter>
      <LogoContainer>
        <Logo src="logo_medium.png" /> Observation Deck
      </LogoContainer>
      <NavTray>
        <NavLink>About</NavLink>
        <NavLink>Documentation</NavLink>
        <NavLink>GitHub</NavLink>
        <NavLink>Contribute</NavLink>
        <NavLink>Browse widgets</NavLink>
      </NavTray>
    </HeaderOuter>
  )
}

export default Header
