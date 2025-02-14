
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Book, Music, Film, GamepadIcon } from 'lucide-react';

const interestIcons = {
  Books: Book,
  Music: Music,
  Films: Film,
  Games: GamepadIcon,
};

const FriendCard = ({ 
  friend, 
  viewMode, 
  selectedInterest,
  selectedFriend,
  setSelectedFriend,
  message,
  setMessage,
  handleSendMessage,
  handleViewProfile 
}) => {
  return (
    <Card 
      className={`
        group hover:shadow-lg transition-all duration-200
        ${viewMode === 'list' ? 'flex items-center' : ''}
      `}
    >
      <CardHeader className={viewMode === 'list' ? 'flex-1' : ''}>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-primary/10 transition-transform group-hover:scale-105">
              <AvatarImage src={friend.avatar} alt={friend.name} />
              <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span 
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white
                ${friend.isOnline ? 'bg-green-500' : 'bg-gray-300'}
              `}
            />
          </div>
          <div className="space-y-1">
            <CardTitle>{friend.name}</CardTitle>
            <div className="flex flex-wrap gap-1">
              {friend.interests.map((interest) => {
                const Icon = interestIcons[interest];
                return (
                  <span 
                    key={interest}
                    className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full 
                      ${selectedInterest === interest ? 'bg-primary text-primary-foreground' : 'bg-muted'}
                      transition-colors duration-200`}
                  >
                    {Icon && <Icon className="h-3 w-3" />}
                    {interest}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className={viewMode === 'list' ? 'flex-1 flex items-center gap-4' : ''}>
        <div className={`mb-4 ${viewMode === 'list' ? 'flex-1 mb-0' : ''}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Match</span>
            <span className="text-lg font-bold text-primary">{friend.matchPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${friend.matchPercentage}%` }}
            />
          </div>
        </div>
        <div className={`flex ${viewMode === 'list' ? 'w-48' : 'space-x-2'}`}>
          <Button 
            className="flex-1 group-hover:bg-primary/90 transition-colors"
            onClick={() => handleViewProfile(friend)}
          >
            View Profile
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                className="flex-1 group-hover:bg-primary/90 transition-colors"
                onClick={() => setSelectedFriend(friend)}
              >
                Send Message
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send Message to {selectedFriend?.name}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col space-y-4">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                />
                <Button onClick={handleSendMessage}>Send</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default FriendCard;
