import React from "react";

function Table({ columns, data }) {

    return (

        <table>

            <thead>

                <tr>

                    {columns.map((column, index) => (

                        <th key={index}>{column}</th>

                    ))}

                </tr>

            </thead>

            <tbody>

                {data.map((row, rowIndex) => (

                    <tr key={rowIndex}>

                        {columns.map((column, columnIndex) => (

                            <td key={columnIndex}>

                                {row[column]}

                            </td>

                        ))}

                    </tr>

                ))}

            </tbody>

        </table>

    );

}

export default Table;