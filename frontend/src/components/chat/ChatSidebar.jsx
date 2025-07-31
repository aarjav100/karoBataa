import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MessageCircle, 
  LogOut, 
  Settings, 
  Users,
  Plus,
  Clock,
  UserPlus,
  UserMinus,
  Phone
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useChat } from '../../contexts/ChatContext';

const ChatSidebar = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const { 
    chats, 
    contacts,
    searchUsers, 
    startChat, 
    activeChat, 
    setActiveChat, 
    loadChats,
    loadContacts,
    addToContacts,
    removeFromContacts,
    isInContacts
  } = useChat();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showContacts, setShowContacts] = useState(false);
  const [addingContact, setAddingContact] = useState(null);

  useEffect(() => {
    const unsubscribeChats = loadChats();
    const unsubscribeContacts = loadContacts();
    return () => {
      unsubscribeChats();
      unsubscribeContacts();
    };
  }, []);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchTerm.trim()) {
        setIsSearching(true);
        try {
          const results = await searchUsers(searchTerm);
          setSearchResults(results);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchTerm]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleStartChat = async (user) => {
    await startChat(user);
    setShowSearch(false);
    setShowContacts(false);
    setSearchTerm('');
    setSearchResults([]);
  };

  const handleAddToContacts = async (user) => {
    try {
      setAddingContact(user.uid);
      await addToContacts(user);
    } catch (error) {
      console.error('Error adding contact:', error);
    } finally {
      setAddingContact(null);
    }
  };

  const handleRemoveFromContacts = async (contactId) => {
    try {
      await removeFromContacts(contactId);
    } catch (error) {
      console.error('Error removing contact:', error);
    }
  };

  const handlePlusButtonClick = async () => {
    // If there's an active chat, add that user to contacts
    if (activeChat && activeChat.uid) {
      try {
        // Get user data from active chat
        const userToAdd = {
          uid: activeChat.uid,
          displayName: activeChat.displayName || 'Unknown User',
          email: activeChat.email || '',
          photoURL: activeChat.photoURL || ''
        };
        
        // Check if already in contacts
        if (isInContacts(activeChat.uid)) {
          // If already in contacts, remove them
          await handleRemoveFromContacts(activeChat.uid);
        } else {
          // If not in contacts, add them
          await handleAddToContacts(userToAdd);
        }
      } catch (error) {
        console.error('Error handling contact operation:', error);
      }
    } else {
      // If no active chat, show search interface
      setShowSearch(!showSearch);
      setShowContacts(false);
    }
  };

  const formatLastMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const getOtherParticipant = (participants) => {
    return participants.find(id => id !== currentUser?.uid);
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <Avatar>
              <AvatarImage src={userProfile?.photoURL} />
              <AvatarFallback>
                {userProfile?.displayName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="font-semibold text-gray-900">
                {userProfile?.displayName || 'User'}
              </h2>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setShowContacts(!showContacts);
                setShowSearch(false);
              }}
              className={showContacts ? 'bg-blue-100 text-blue-600' : ''}
            >
              <Phone className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePlusButtonClick}
              disabled={addingContact === activeChat?.uid}
              title={
                activeChat && isInContacts(activeChat.uid) ? 'Remove from contacts' :
                activeChat ? 'Add to contacts' :
                'Search users'
              }
              className={
                showSearch ? 'bg-blue-100 text-blue-600' : 
                activeChat && isInContacts(activeChat.uid) ? 'bg-red-100 text-red-600' :
                activeChat ? 'bg-green-100 text-green-600' : ''
              }
            >
              {addingContact === activeChat?.uid ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              ) : activeChat && isInContacts(activeChat.uid) ? (
                <UserMinus className="h-4 w-4" />
              ) : activeChat ? (
                <UserPlus className="h-4 w-4" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder={
              showContacts ? "Search contacts..." :
              showSearch ? "Search users..." : 
              "Search chats..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {showContacts ? (
          /* Contacts View */
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">
              Contacts ({contacts.length})
            </h3>
            {contacts.length > 0 ? (
              <div className="space-y-1">
                {contacts
                  .filter(contact => 
                    !searchTerm || 
                    contact.contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    contact.contactEmail.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((contact) => (
                    <Card
                      key={contact.id}
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleStartChat({ uid: contact.contactId, displayName: contact.contactName })}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={contact.contactPhotoURL} />
                            <AvatarFallback>
                              {contact.contactName?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {contact.contactName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {contact.contactEmail}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFromContacts(contact.contactId);
                          }}
                          className="text-red-500 hover:text-red-700"
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Phone className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No contacts yet</p>
                <p className="text-sm">Add users to your contacts to chat with them</p>
              </div>
            )}
          </div>
        ) : showSearch && searchTerm ? (
          /* Search Results */
          <div className="p-2">
            <h3 className="text-sm font-medium text-gray-500 mb-2 px-2">
              Search Results
            </h3>
            {isSearching ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="space-y-1">
                {searchResults.map((user) => {
                  const isContact = isInContacts(user.uid);
                  return (
                    <Card
                      key={user.id}
                      className="p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleStartChat(user)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.photoURL} />
                            <AvatarFallback>
                              {user.displayName?.charAt(0)?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-gray-900 truncate">
                              {user.displayName}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                          {user.isOnline && (
                            <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (isContact) {
                              handleRemoveFromContacts(user.uid);
                            } else {
                              handleAddToContacts(user);
                            }
                          }}
                          disabled={addingContact === user.uid}
                          className={isContact ? "text-red-500 hover:text-red-700" : "text-blue-500 hover:text-blue-700"}
                        >
                          {addingContact === user.uid ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                          ) : isContact ? (
                            <UserMinus className="h-4 w-4" />
                          ) : (
                            <UserPlus className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No users found</p>
              </div>
            )}
          </div>
        ) : (
          /* Chat List */
          <div className="p-2">
            {chats.length > 0 ? (
              <div className="space-y-1">
                {chats.map((chat) => {
                  const otherParticipantId = getOtherParticipant(chat.participants);
                  const isActive = activeChat?.uid === otherParticipantId;
                  
                  return (
                    <Card
                      key={chat.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        isActive ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setActiveChat({ uid: otherParticipantId })}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {otherParticipantId?.charAt(0)?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-gray-900 truncate">
                              {otherParticipantId || 'Unknown User'}
                            </p>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">
                                {formatLastMessageTime(chat.lastMessageTime)}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-500 truncate">
                            {chat.lastMessageType === 'image' ? '📷 Image' : chat.lastMessage}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="font-medium mb-2">No conversations yet</h3>
                <p className="text-sm">Start a new chat by searching for users or adding contacts</p>
                <div className="flex space-x-2 mt-4 justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowSearch(true)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Search Users
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowContacts(true)}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    View Contacts
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

