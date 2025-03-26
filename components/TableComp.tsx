
const TableComp = ()=>{
    return(
        <div className="overflow-x-auto p-4">
      <table className="w-full border-collapse bg-white shadow-lg rounded-lg">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="p-3 text-left">Link</th>
            <th className="p-3 text-left">Clicks</th>
          </tr>
        </thead>
        <tbody>
            <tr className="border-b">
              <td className="p-3">{"www.google.com"}</td>
              <td className="p-3">890</td>
            </tr>
        </tbody>
      </table>
    </div>
    )
}

export default TableComp