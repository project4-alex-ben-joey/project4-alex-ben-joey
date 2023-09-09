import React, {useState} from "react";


const Section1 = () => {

const [searchInput, setSearchInput] = useState("");

const concerts = [





];

const handleChange = (e) => {
    e.preventDefault();
    setSearchInput(e.target.value);
};

if (searchInput.length > 0) {
    countries.filter((concerts) => {
        return concerts.name.match(searchInput);
});
}

return 
<div>
    <input
        type="search"
        placeholder="Search here"
        onChange={handleChange}
        value={searchInput} />

    <table>
        <tr>
            <th>Concert</th>
            <th>Band</th>
        </tr>
    </table>
</div>

}


export default Section1;