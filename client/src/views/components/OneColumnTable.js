import React from 'react';

const OneColumnTable = ({ header, data }) => {
    return (
    <table className="table table-bordered table-hover">
        <thead>
        <tr>
        <th>{header}</th>
        </tr>
        </thead>
        <tbody>
        { data.map((row, i) => <tr key={i}><td>{row}</td></tr>) }
        </tbody>
    </table>
    )
}

export default OneColumnTable;
