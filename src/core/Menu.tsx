import * as React from 'react';
import { Div, Txt } from 'elmnt';
import { compose, enclose, map, withHover, Wrap } from 'mishmash';
import { Link, withWidth } from 'common-client';

import styles from '../core/styles';

import * as logo from '../img/logo.png';

const textStyle = active => ({
  ...styles.text,
  color: '#878787',
  fontSize: 14,
  fontWeight: 'normal' as 'normal',
  padding: '7px 15px',
  borderRadius: 5,
  background: active ? 'rgba(0,117,176,0.1)' : 'transparent',
});

const MenuLink = withHover(
  ({ text, to, newTab, active, setClosed, isHovered, hoverProps }: any) => (
    <Link
      to={to}
      newTab={newTab}
      onClick={setClosed}
      {...hoverProps}
      style={{
        display: 'block',
        padding: 5,
        margin: -5,
        textAlign: 'center',
      }}
    >
      <Txt style={textStyle(isHovered || active === to)}>{text}</Txt>
    </Link>
  ),
);

export default compose(
  withWidth(800),
  map(({ small = true, ...props }) => ({ small, ...props })),
  enclose(
    ({ setState }) => {
      const toggle = () => setState(({ isOpen }) => ({ isOpen: !isOpen }));
      const setClosed = () => setState({ isOpen: false });
      return (props, state) => {
        if (state.isOpen && !props.small) setTimeout(setClosed);
        return { ...props, ...state, toggle, setClosed };
      };
    },
    { isOpen: false },
  ),
)(({ isOpen, toggle, setClosed, small, setWidthElem }) => (
  <div
    style={{
      background: 'white',
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
    }}
    ref={setWidthElem}
  >
    <Div>
      <Div
        style={{
          layout: 'bar',
          maxWidth: 1150,
          padding: '20px 15px 21px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <Link
          to="http://www.worthwhile.org.uk/"
          onClick={setClosed}
          style={{ display: 'block', padding: '10px 5px', margin: -5 }}
        >
          <img src={logo} style={{ width: 'auto', height: 18 }} />
        </Link>
        {small ? (
          <Wrap hoc={withHover}>
            {({ isHovered, hoverProps }) => (
              <Div
                onClick={toggle}
                {...hoverProps}
                style={{
                  spacing: 5,
                  float: 'right',
                  padding: '8px 5px',
                  margin: '-8px -5px',
                  cursor: 'pointer',
                  ...(isHovered ? { background: '#eee' } : {}),
                }}
              >
                {[0, 1, 2].map(i => (
                  <div
                    style={{
                      width: 24,
                      height: 3,
                      background: '#0075b0',
                      borderRadius: 10,
                    }}
                    key={i}
                  />
                ))}
              </Div>
            )}
          </Wrap>
        ) : (
          <Div style={{ layout: 'bar', spacing: 10, float: 'right' }}>
            <MenuLink
              text="Looking for a job?"
              to="http://www.worthwhile.org.uk/looking-for-a-job"
            />
            <MenuLink
              text="Social Enterprise?"
              to="http://www.worthwhile.org.uk/social-enterprise"
            />
            <MenuLink text="About" to="http://www.worthwhile.org.uk/about" />
            <MenuLink text="Blog" to="http://www.worthwhile.org.uk/blog" />
          </Div>
        )}
      </Div>
      {small && (
        <div
          style={{
            overflow: 'hidden',
            transition: 'height 0.35s ease',
            height: isOpen ? 162 : 0,
          }}
        >
          <Div style={{ spacing: 10, padding: '0 20px 20px' }}>
            <MenuLink
              text="Looking for a job?"
              to="http://www.worthwhile.org.uk/looking-for-a-job"
            />
            <MenuLink
              text="Social Enterprise?"
              to="http://www.worthwhile.org.uk/social-enterprise"
            />
            <MenuLink text="About" to="http://www.worthwhile.org.uk/about" />
            <MenuLink text="Blog" to="http://www.worthwhile.org.uk/blog" />
          </Div>
        </div>
      )}
    </Div>
  </div>
));
