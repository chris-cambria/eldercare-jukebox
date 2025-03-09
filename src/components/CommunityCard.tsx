
import { MessageSquare, Users, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface CommunityCardProps {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  messageCount: number;
  imageUrl?: string;
}

const CommunityCard = ({
  id,
  name,
  description,
  memberCount,
  messageCount,
  imageUrl
}: CommunityCardProps) => {
  return (
    <Link 
      to={`/community/${id}`}
      className="block rounded-lg border border-border bg-card text-card-foreground p-5 transition-all duration-300 card-hover"
    >
      <div className="flex">
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center bg-primary/10 text-primary mr-4 overflow-hidden"
        >
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <Users className="h-6 w-6" />
          )}
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h3 className="font-medium text-lg">{name}</h3>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {description}
          </p>
          
          <div className="flex items-center mt-3 text-xs text-muted-foreground">
            <div className="flex items-center mr-4">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span>{memberCount} members</span>
            </div>
            
            <div className="flex items-center">
              <MessageSquare className="h-3.5 w-3.5 mr-1" />
              <span>{messageCount} messages</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CommunityCard;
