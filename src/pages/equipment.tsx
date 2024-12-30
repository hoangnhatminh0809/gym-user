import { useState, useEffect } from "react"
import api from "../services/api"
import Sidebar from "../components/dashboard/Sidebar"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../components/ui/alert-dialog"

interface Equipment {
  id: number;
  name: string;
  room: number;
  quantity: number;
  import_date: string;
  warranty_date: string;
  origin: string;
  last_check: string;
  status: string;
}

const Equipment = () => {
  const [equipments, setEquipments] = useState<Equipment[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newEquipment, setNewEquipment] = useState<Partial<Equipment>>({
    name: '',
    room: 0,
    quantity: 0,
    import_date: '',
    warranty_date: '',
    origin: '',
    last_check: '',
    status: ''
  });
  const [equipmentToDelete, setEquipmentToDelete] = useState<number | null>(null)


  useEffect(() => {
    fetchEquipments().then(setEquipments)
  }, [])

  const fetchEquipments = async () => {
    const response = await api.get<Equipment[]>(`/room/api/equipments/`)
    return response.data
  }

  const handleAdd = async () => {
    try {
      const response = await api.post('/room/api/equipments/', newEquipment)
      setEquipments([...equipments, response.data])
      setNewEquipment({})
      setIsAddDialogOpen(false)
    } catch (error) {
      console.error('Failed to add equipment:', error)
    }
  }

  const handleDeleteClick = (id: number) => {
    setEquipmentToDelete(id)
  }

  const handleConfirmDelete = async () => {
    if (equipmentToDelete) {
      await api.delete(`/room/api/equipments/${equipmentToDelete}/`)
      setEquipments(equipments.filter(item => item.id !== equipmentToDelete))
      setEquipmentToDelete(null)
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Equipment Management</CardTitle>
              <CardDescription>Manage your gym equipment inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AlertDialog open={isAddDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Equipment</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Equipment</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Input
                          placeholder="Name"
                          value={newEquipment.name || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                        />
                        <Input
                          type="number"
                          placeholder="Room"
                          value={newEquipment.room || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, room: parseInt(e.target.value) })}
                        />
                        <Input
                          type="number"
                          placeholder="Quantity"
                          value={newEquipment.quantity || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, quantity: parseInt(e.target.value) })}
                        />
                        <Input
                          type="date"
                          placeholder="Import Date"
                          value={newEquipment.import_date || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, import_date: e.target.value })}
                        />
                        <Input
                          type="date"
                          placeholder="Warranty Date"
                          value={newEquipment.warranty_date || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, warranty_date: e.target.value })}
                        />
                        <Input
                          placeholder="Origin"
                          value={newEquipment.origin || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, origin: e.target.value })}
                        />
                        <Input
                          type="date"
                          placeholder="Last Check"
                          value={newEquipment.last_check || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, last_check: e.target.value })}
                        />
                        <Input
                          placeholder="Status"
                          value={newEquipment.status || ''}
                          onChange={(e) => setNewEquipment({ ...newEquipment, status: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleAdd}>
                        Add Equipment
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {equipments.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.room}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => { }}>
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={equipmentToDelete === item.id}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)}>
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the equipment.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setEquipmentToDelete(null)}>
                                  Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction onClick={handleConfirmDelete}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

const FilePenIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
  </svg>
)

const Trash2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    <line x1="10" x2="10" y1="11" y2="17" />
    <line x1="14" x2="14" y1="11" y2="17" />
  </svg>
)

export default Equipment