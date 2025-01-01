import { useState, useEffect } from "react"
import api from "../services/api"
import Sidebar from "../components/dashboard/Sidebar"
import DashboardHeader from "../components/dashboard/DashboardHeader"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"
import { Label } from "@/components/ui/label"
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

export interface Room {
  id: number;
  name: string;
}

const Room = () => {
  const [rooms, setRooms] = useState<Room[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newRoom, setNewRoom] = useState<Partial<Room>>({
    name: '',
  });
  const [editRoom, setEditRoom] = useState<Partial<Room>>({
    id: 0,
    name: '',
  });
  const [roomToDelete, setRoomToDelete] = useState<number | null>(null)

  useEffect(() => {
    fetchRooms().then(setRooms)
  }, [])

  const fetchRooms = async () => {
    const response = await api.get<Room[]>(`/room/api/rooms/`)
    return response.data
  }

  const handleAdd = async () => {
    try {
      const response = await api.post<Room>(`/room/api/rooms/`, newRoom);
      setRooms([...rooms, response.data]); // Add the new room to the list
      setNewRoom({ // Reset the form
        name: "",
      });
      setIsAddDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to add room:", error);
    }
  };

  const handleEditClick = (room: Room) => {
    setEditRoom(room);
    setIsEditDialogOpen(true);
  };

  const handleEdit = async () => {
    try {
      const response = await api.put<Room>(`/room/api/rooms/${editRoom.id}/`, editRoom);
      setRooms(rooms.map(r => r.id === editRoom.id ? response.data : r)); // Update the room in the list
      setEditRoom({ // Reset the form
        id: 0,
        name: "",
      });
      setIsEditDialogOpen(false); // Close the dialog
    } catch (error) {
      console.error("Failed to edit room:", error);
      alert("Failed to edit room");
    }
  };

  const handleDeleteClick = (id: number) => {
    setRoomToDelete(id);
  };

  const handleConfirmDelete = async () => {
    if (roomToDelete) {
      await api.delete(`/room/api/rooms/${roomToDelete}/`);
      setRooms(rooms.filter((item) => item.id !== roomToDelete));
      setRoomToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <div className="p-6">
          <Card>
            <CardHeader>
              <CardTitle>Room Management</CardTitle>
              <CardDescription>Manage your gym's rooms</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <AlertDialog open={isAddDialogOpen}>
                  <AlertDialogTrigger asChild>
                    <Button onClick={() => setIsAddDialogOpen(true)}>Add Room</Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Add New Room</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Input
                          placeholder="Name"
                          value={newRoom.name || ''}
                          onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsAddDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleAdd}>
                        Add Room
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog open={isEditDialogOpen}>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Edit Room</AlertDialogTitle>
                    </AlertDialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 items-center gap-4">
                        <Label>Name</Label>
                        <Input
                          placeholder="Name"
                          value={editRoom.name || ''}
                          onChange={(e) => setEditRoom({ ...editRoom, name: e.target.value })}
                        />
                      </div>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction onClick={handleEdit}>
                        Edit Room
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
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rooms.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.id}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="icon" onClick={() => handleEditClick(item)}>
                            <FilePenIcon className="h-4 w-4" />
                          </Button>
                          <AlertDialog open={roomToDelete === item.id}>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="icon" onClick={() => handleDeleteClick(item.id)}>
                                <Trash2Icon className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete the room.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setRoomToDelete(null)}>
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

export default Room