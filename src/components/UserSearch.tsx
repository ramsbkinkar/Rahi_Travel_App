import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@/integration/api/client';
import { apiClient } from '@/integration/api/client';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader, Search, User as UserIcon } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';

interface UserSearchProps {
  placeholder?: string;
}

const UserSearch: React.FC<UserSearchProps> = ({ placeholder = 'Search users...' }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const debouncedQuery = useDebounce(searchQuery, 300);
  
  // Search for users when the debounced query changes
  useEffect(() => {
    const searchUsers = async () => {
      if (!debouncedQuery || debouncedQuery.length < 2) {
        setUsers([]);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await apiClient.searchUsers(debouncedQuery);
        
        if (response.status === 'success' && response.data) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        console.error('Error searching users:', err);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    
    searchUsers();
  }, [debouncedQuery]);
  
  const handleSelectUser = (userId: number) => {
    navigate(`/profile/${userId}`);
    setOpen(false);
    setSearchQuery('');
  };
  
  return (
    <div className="relative">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="relative w-full">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder={placeholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4"
              onClick={() => setOpen(true)}
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-[300px]" align="start">
          <Command>
            <CommandInput
              placeholder={placeholder}
              value={searchQuery}
              onValueChange={setSearchQuery}
              className="border-none focus:ring-0"
            />
            <CommandList>
              {loading && (
                <div className="flex justify-center items-center py-4">
                  <Loader className="h-4 w-4 animate-spin text-gray-400" />
                </div>
              )}
              
              {!loading && (
                <CommandEmpty>
                  {searchQuery.length > 0 ? (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No users found
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      Type to search for users
                    </div>
                  )}
                </CommandEmpty>
              )}
              
              {users.length > 0 && (
                <CommandGroup heading="Users">
                  {users.map((user) => (
                    <CommandItem 
                      key={user.id}
                      onSelect={() => handleSelectUser(user.id)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user.avatar_url || `https://i.pravatar.cc/150?u=${user.id}`}
                            alt={user.name} 
                          />
                          <AvatarFallback>
                            <UserIcon className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          {user.bio && (
                            <p className="text-xs text-gray-500 truncate max-w-[200px]">
                              {user.bio}
                            </p>
                          )}
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserSearch; 