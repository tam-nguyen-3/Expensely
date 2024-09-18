import { useState, useEffect, useMemo } from "react"
import { MaterialReactTable, useMaterialReactTable } from "material-react-table" // new for the material-ui table
import axios from 'axios'
const baseUrl = 'http://localhost:3001/api/transactions' // change to /api/transactions once connect to backend (dist)

const App = () => {
  const [transactions, setTransactions] = useState([])

  useEffect(() => {
    axios.get(baseUrl).then(response => {
      setTransactions(response.data)
      console.log(transactions)
    })
  }, [transactions])

  const columns = useMemo(() => [
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "date",
      header: "Date",
    },
  ], [])

  const table = useMaterialReactTable({
    transactions,
    columns
  })

  return (
    <div className="p-5 h-screen">
      <MaterialReactTable table={table}/>
    </div>
  )
}

export default App;