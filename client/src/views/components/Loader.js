import React from 'react';
import { default as ReactLoaderSpinner } from 'react-loader-spinner';

const Loader = ({ children, loaded }) => {
    return (
        loaded ? children :
        <ReactLoaderSpinner
            type="ThreeDots"
            color="#5969FF"
            height={75}
            width={75}
        />
    );
}

export default Loader;