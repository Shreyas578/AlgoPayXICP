"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

interface TicketBookingModalProps {
  isOpen: boolean
  onClose: () => void
  onTransactionComplete: (transaction: any) => void
}

export default function TicketBookingModal({ isOpen, onClose, onTransactionComplete }: TicketBookingModalProps) {
  const [activeTab, setActiveTab] = useState("flights")
  const [showPinVerification, setShowPinVerification] = useState(false)
  const [pin, setPin] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentBooking, setCurrentBooking] = useState<any>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // Flight State
  const [flightForm, setFlightForm] = useState({
    from: "",
    to: "",
    departDate: undefined as Date | undefined,
    returnDate: undefined as Date | undefined,
    passengers: "1",
    class: "economy",
  })

  // Train State
  const [trainForm, setTrainForm] = useState({
    from: "",
    to: "",
    departDate: undefined as Date | undefined,
    passengers: "1",
    class: "2A",
  })

  // Bus State
  const [busForm, setBusForm] = useState({
    from: "",
    to: "",
    departDate: undefined as Date | undefined,
    passengers: "1",
  })

  // Cab State
  const [cabForm, setCabForm] = useState({
    pickup: "",
    destination: "",
    rideType: "standard",
    scheduleDate: undefined as Date | undefined,
  })

  // Events State
  const [eventForm, setEventForm] = useState({
    eventType: "",
    location: "",
    eventDate: undefined as Date | undefined,
    tickets: "1",
  })

  const mockSearchResults = {
    flights: [
      {
        id: 1,
        airline: "Delta Airlines",
        departure: "09:30",
        arrival: "14:45",
        duration: "5h 15m",
        price: 299,
        stops: "Non-stop",
      },
      {
        id: 2,
        airline: "American Airlines",
        departure: "11:15",
        arrival: "17:30",
        duration: "6h 15m",
        price: 259,
        stops: "1 stop",
      },
      {
        id: 3,
        airline: "United Airlines",
        departure: "15:20",
        arrival: "20:35",
        duration: "5h 15m",
        price: 329,
        stops: "Non-stop",
      },
    ],
    trains: [
      {
        id: 1,
        train: "Rajdhani Express",
        departure: "16:55",
        arrival: "08:20",
        duration: "15h 25m",
        price: 89,
        class: "2A",
      },
      {
        id: 2,
        train: "Shatabdi Express",
        departure: "06:00",
        arrival: "12:30",
        duration: "6h 30m",
        price: 45,
        class: "CC",
      },
      {
        id: 3,
        train: "Duronto Express",
        departure: "22:15",
        arrival: "14:45",
        duration: "16h 30m",
        price: 125,
        class: "1A",
      },
    ],
    buses: [
      {
        id: 1,
        operator: "Greyhound",
        departure: "08:00",
        arrival: "16:30",
        duration: "8h 30m",
        price: 45,
        type: "AC Sleeper",
      },
      {
        id: 2,
        operator: "Megabus",
        departure: "14:30",
        arrival: "22:15",
        duration: "7h 45m",
        price: 35,
        type: "AC Semi-Sleeper",
      },
      {
        id: 3,
        operator: "FlixBus",
        departure: "23:45",
        arrival: "07:30",
        duration: "7h 45m",
        price: 55,
        type: "AC Sleeper",
      },
    ],
    cabs: [
      { id: 1, type: "Standard", eta: "3 mins", price: 12, driver: "John D.", rating: 4.8 },
      { id: 2, type: "Premium", eta: "5 mins", price: 18, driver: "Sarah M.", rating: 4.9 },
      { id: 3, type: "Luxury", eta: "8 mins", price: 35, driver: "Mike R.", rating: 5.0 },
    ],
    events: [
      {
        id: 1,
        name: "Lakers vs Warriors",
        venue: "Staples Center",
        date: "Dec 25",
        time: "19:30",
        price: 125,
        category: "Sports",
      },
      {
        id: 2,
        name: "Taylor Swift Concert",
        venue: "Madison Square Garden",
        date: "Jan 15",
        time: "20:00",
        price: 299,
        category: "Music",
      },
      {
        id: 3,
        name: "Broadway Show - Hamilton",
        venue: "Richard Rodgers Theatre",
        date: "Feb 10",
        time: "19:00",
        price: 189,
        category: "Theatre",
      },
    ],
  }

  const handleSearch = async (type: string) => {
    setIsSearching(true)
    // Simulate API call
    setTimeout(() => {
      setSearchResults(mockSearchResults[type as keyof typeof mockSearchResults] || [])
      setIsSearching(false)
    }, 1500)
  }

  const handleBooking = (item: any, type: string) => {
    setCurrentBooking({ ...item, type, bookingId: Math.random().toString(36).substr(2, 9) })
    setShowPinVerification(true)
  }

  const handlePinSubmit = async () => {
    if (pin.length !== 6) return

    setIsProcessing(true)

    setTimeout(() => {
      const transaction = {
        id: currentBooking.bookingId,
        type: `${currentBooking.type}-booking`,
        amount: currentBooking.price.toString(),
        recipient:
          currentBooking.name ||
          currentBooking.airline ||
          currentBooking.train ||
          currentBooking.operator ||
          currentBooking.type,
        timestamp: new Date(),
        status: "completed",
        category: "booking",
      }

      onTransactionComplete(transaction)
      setIsProcessing(false)
      setShowPinVerification(false)
      setPin("")
      onClose()

      // Reset forms and results
      setSearchResults([])
      setFlightForm({
        from: "",
        to: "",
        departDate: undefined,
        returnDate: undefined,
        passengers: "1",
        class: "economy",
      })
      setTrainForm({ from: "", to: "", departDate: undefined, passengers: "1", class: "2A" })
      setBusForm({ from: "", to: "", departDate: undefined, passengers: "1" })
      setCabForm({ pickup: "", destination: "", rideType: "standard", scheduleDate: undefined })
      setEventForm({ eventType: "", location: "", eventDate: undefined, tickets: "1" })
    }, 2000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl bg-card border-border max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-mono text-primary">Book Tickets</DialogTitle>
          <DialogDescription>Book flights, trains, buses, cabs, and event tickets</DialogDescription>
        </DialogHeader>

        {!showPinVerification ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 bg-secondary">
              <TabsTrigger
                value="flights"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Flights
              </TabsTrigger>
              <TabsTrigger
                value="trains"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Trains
              </TabsTrigger>
              <TabsTrigger
                value="buses"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Buses
              </TabsTrigger>
              <TabsTrigger
                value="cabs"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Cabs
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                Events
              </TabsTrigger>
            </TabsList>

            <TabsContent value="flights" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">✈️</span>
                    Flight Booking
                  </CardTitle>
                  <CardDescription>Search and book domestic and international flights</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="flightFrom">From</Label>
                      <Input
                        id="flightFrom"
                        placeholder="Departure city"
                        value={flightForm.from}
                        onChange={(e) => setFlightForm({ ...flightForm, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="flightTo">To</Label>
                      <Input
                        id="flightTo"
                        placeholder="Destination city"
                        value={flightForm.to}
                        onChange={(e) => setFlightForm({ ...flightForm, to: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Departure Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {flightForm.departDate ? format(flightForm.departDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={flightForm.departDate}
                            onSelect={(date) => setFlightForm({ ...flightForm, departDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="passengers">Passengers</Label>
                      <Select
                        value={flightForm.passengers}
                        onValueChange={(value) => setFlightForm({ ...flightForm, passengers: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="class">Class</Label>
                      <Select
                        value={flightForm.class}
                        onValueChange={(value) => setFlightForm({ ...flightForm, class: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="economy">Economy</SelectItem>
                          <SelectItem value="premium">Premium Economy</SelectItem>
                          <SelectItem value="business">Business</SelectItem>
                          <SelectItem value="first">First Class</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSearch("flights")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!flightForm.from || !flightForm.to || !flightForm.departDate || isSearching}
                  >
                    {isSearching ? "Searching Flights..." : "Search Flights"}
                  </Button>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Flights</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((flight: any) => (
                        <div
                          key={flight.id}
                          className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-semibold">{flight.airline}</div>
                            <div className="text-sm text-muted-foreground">
                              {flight.departure} - {flight.arrival} • {flight.duration} • {flight.stops}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${flight.price}</div>
                            <Button
                              onClick={() => handleBooking(flight, "flight")}
                              className="mt-2 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="trains" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🚂</span>
                    Train Booking
                  </CardTitle>
                  <CardDescription>Book train tickets for your journey</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainFrom">From Station</Label>
                      <Input
                        id="trainFrom"
                        placeholder="Departure station"
                        value={trainForm.from}
                        onChange={(e) => setTrainForm({ ...trainForm, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trainTo">To Station</Label>
                      <Input
                        id="trainTo"
                        placeholder="Destination station"
                        value={trainForm.to}
                        onChange={(e) => setTrainForm({ ...trainForm, to: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Journey Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {trainForm.departDate ? format(trainForm.departDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={trainForm.departDate}
                            onSelect={(date) => setTrainForm({ ...trainForm, departDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trainPassengers">Passengers</Label>
                      <Select
                        value={trainForm.passengers}
                        onValueChange={(value) => setTrainForm({ ...trainForm, passengers: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="trainClass">Class</Label>
                      <Select
                        value={trainForm.class}
                        onValueChange={(value) => setTrainForm({ ...trainForm, class: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SL">Sleeper (SL)</SelectItem>
                          <SelectItem value="3A">AC 3 Tier (3A)</SelectItem>
                          <SelectItem value="2A">AC 2 Tier (2A)</SelectItem>
                          <SelectItem value="1A">AC First Class (1A)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSearch("trains")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!trainForm.from || !trainForm.to || !trainForm.departDate || isSearching}
                  >
                    {isSearching ? "Searching Trains..." : "Search Trains"}
                  </Button>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Trains</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((train: any) => (
                        <div
                          key={train.id}
                          className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-semibold">{train.train}</div>
                            <div className="text-sm text-muted-foreground">
                              {train.departure} - {train.arrival} • {train.duration} • {train.class}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${train.price}</div>
                            <Button
                              onClick={() => handleBooking(train, "train")}
                              className="mt-2 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="buses" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🚌</span>
                    Bus Booking
                  </CardTitle>
                  <CardDescription>Book bus tickets for intercity travel</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="busFrom">From</Label>
                      <Input
                        id="busFrom"
                        placeholder="Departure city"
                        value={busForm.from}
                        onChange={(e) => setBusForm({ ...busForm, from: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="busTo">To</Label>
                      <Input
                        id="busTo"
                        placeholder="Destination city"
                        value={busForm.to}
                        onChange={(e) => setBusForm({ ...busForm, to: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Journey Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {busForm.departDate ? format(busForm.departDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={busForm.departDate}
                            onSelect={(date) => setBusForm({ ...busForm, departDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="busPassengers">Passengers</Label>
                      <Select
                        value={busForm.passengers}
                        onValueChange={(value) => setBusForm({ ...busForm, passengers: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Passenger" : "Passengers"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSearch("buses")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!busForm.from || !busForm.to || !busForm.departDate || isSearching}
                  >
                    {isSearching ? "Searching Buses..." : "Search Buses"}
                  </Button>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Buses</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((bus: any) => (
                        <div key={bus.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                          <div className="flex-1">
                            <div className="font-semibold">{bus.operator}</div>
                            <div className="text-sm text-muted-foreground">
                              {bus.departure} - {bus.arrival} • {bus.duration} • {bus.type}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${bus.price}</div>
                            <Button
                              onClick={() => handleBooking(bus, "bus")}
                              className="mt-2 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="cabs" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🚗</span>
                    Cab Booking
                  </CardTitle>
                  <CardDescription>Book a cab for local transportation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="pickup">Pickup Location</Label>
                      <Input
                        id="pickup"
                        placeholder="Enter pickup address"
                        value={cabForm.pickup}
                        onChange={(e) => setCabForm({ ...cabForm, pickup: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="destination">Destination</Label>
                      <Input
                        id="destination"
                        placeholder="Enter destination address"
                        value={cabForm.destination}
                        onChange={(e) => setCabForm({ ...cabForm, destination: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rideType">Ride Type</Label>
                    <Select
                      value={cabForm.rideType}
                      onValueChange={(value) => setCabForm({ ...cabForm, rideType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="standard">Standard</SelectItem>
                        <SelectItem value="premium">Premium</SelectItem>
                        <SelectItem value="luxury">Luxury</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={() => handleSearch("cabs")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!cabForm.pickup || !cabForm.destination || isSearching}
                  >
                    {isSearching ? "Finding Cabs..." : "Find Cabs"}
                  </Button>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Cabs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((cab: any) => (
                        <div key={cab.id} className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg">
                          <div className="flex-1">
                            <div className="font-semibold">{cab.type}</div>
                            <div className="text-sm text-muted-foreground">
                              Driver: {cab.driver} • Rating: {cab.rating}⭐ • ETA: {cab.eta}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${cab.price}</div>
                            <Button
                              onClick={() => handleBooking(cab, "cab")}
                              className="mt-2 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="events" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-xl">🎫</span>
                    Event Tickets
                  </CardTitle>
                  <CardDescription>Book tickets for sports matches, concerts, and shows</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select
                        value={eventForm.eventType}
                        onValueChange={(value) => setEventForm({ ...eventForm, eventType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sports">Sports</SelectItem>
                          <SelectItem value="music">Music/Concerts</SelectItem>
                          <SelectItem value="theatre">Theatre/Shows</SelectItem>
                          <SelectItem value="comedy">Comedy</SelectItem>
                          <SelectItem value="festivals">Festivals</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventLocation">Location</Label>
                      <Input
                        id="eventLocation"
                        placeholder="City or venue"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Event Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {eventForm.eventDate ? format(eventForm.eventDate, "PPP") : "Any date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={eventForm.eventDate}
                            onSelect={(date) => setEventForm({ ...eventForm, eventDate: date })}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="eventTickets">Number of Tickets</Label>
                      <Select
                        value={eventForm.tickets}
                        onValueChange={(value) => setEventForm({ ...eventForm, tickets: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num} {num === 1 ? "Ticket" : "Tickets"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Button
                    onClick={() => handleSearch("events")}
                    className="w-full bg-primary hover:bg-primary/90"
                    disabled={!eventForm.eventType || isSearching}
                  >
                    {isSearching ? "Searching Events..." : "Search Events"}
                  </Button>
                </CardContent>
              </Card>

              {searchResults.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Available Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {searchResults.map((event: any) => (
                        <div
                          key={event.id}
                          className="flex items-center justify-between p-4 bg-secondary/20 rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-semibold">{event.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {event.venue} • {event.date} at {event.time} • {event.category}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-bold text-primary">${event.price}</div>
                            <Button
                              onClick={() => handleBooking(event, "event")}
                              className="mt-2 bg-primary hover:bg-primary/90"
                              size="sm"
                            >
                              Book Now
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        ) : (
          <div className="space-y-6 py-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto animate-pulse-glow">
                <span className="text-2xl">🔐</span>
              </div>
              <div>
                <h3 className="text-xl font-semibold">Confirm Booking</h3>
                <p className="text-muted-foreground">Enter your 6-digit PIN to complete booking</p>
              </div>

              {currentBooking && (
                <div className="bg-secondary/20 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Booking ID:</span>
                    <span className="font-semibold">{currentBooking.bookingId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount:</span>
                    <span className="font-semibold text-primary">${currentBooking.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Service:</span>
                    <span className="font-semibold">
                      {currentBooking.name ||
                        currentBooking.airline ||
                        currentBooking.train ||
                        currentBooking.operator ||
                        currentBooking.type}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bookingPin">Transaction PIN</Label>
                <Input
                  id="bookingPin"
                  type="password"
                  placeholder="Enter 6-digit PIN"
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  className="text-center text-2xl tracking-widest font-mono"
                  maxLength={6}
                />
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowPinVerification(false)
                    setPin("")
                  }}
                  className="flex-1 bg-transparent"
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handlePinSubmit}
                  className="flex-1 bg-primary hover:bg-primary/90"
                  disabled={pin.length !== 6 || isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Booking...
                    </div>
                  ) : (
                    "Confirm Booking"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
