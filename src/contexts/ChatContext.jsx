import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
  getDoc,
  getDocs,
  limit,
  startAfter
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { useAuth } from './AuthContext';

const ChatContext = createContext();

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [chats, setChats] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [loading, setLoading] = useState(false);

  // Send a text message
  const sendMessage = async (receiverId, messageText, messageType = 'text') => {
    if (!currentUser || !messageText.trim()) return;

    try {
      const chatId = getChatId(currentUser.uid, receiverId);
      
      const messageData = {
        senderId: currentUser.uid,
        receiverId: receiverId,
        message: messageText,
        messageType: messageType,
        timestamp: serverTimestamp(),
        isRead: false,
        chatId: chatId
      };

      await addDoc(collection(db, 'messages'), messageData);
      
      // Update or create chat document
      await updateChatLastMessage(chatId, currentUser.uid, receiverId, messageText, messageType);
      
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  };

  // Send an image message
  const sendImageMessage = async (receiverId, imageFile) => {
    if (!currentUser || !imageFile) return;

    try {
      setLoading(true);
      
      // Upload image to Firebase Storage
      const imageRef = ref(storage, `chat-images/${currentUser.uid}/${Date.now()}_${imageFile.name}`);
      const uploadResult = await uploadBytes(imageRef, imageFile);
      const downloadURL = await getDownloadURL(uploadResult.ref);

      const chatId = getChatId(currentUser.uid, receiverId);
      
      const messageData = {
        senderId: currentUser.uid,
        receiverId: receiverId,
        message: '',
        imageUrl: downloadURL,
        messageType: 'image',
        timestamp: serverTimestamp(),
        isRead: false,
        chatId: chatId
      };

      await addDoc(collection(db, 'messages'), messageData);
      
      // Update chat with image message
      await updateChatLastMessage(chatId, currentUser.uid, receiverId, '📷 Image', 'image');
      
    } catch (error) {
      console.error('Error sending image:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Generate consistent chat ID
  const getChatId = (userId1, userId2) => {
    return userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;
  };

  // Update chat document with last message
  const updateChatLastMessage = async (chatId, senderId, receiverId, lastMessage, messageType) => {
    try {
      const chatRef = doc(db, 'chats', chatId);
      
      await updateDoc(chatRef, {
        participants: [senderId, receiverId],
        lastMessage: lastMessage,
        lastMessageType: messageType,
        lastMessageTime: serverTimestamp(),
        lastMessageSenderId: senderId,
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      // If chat doesn't exist, create it
      try {
        await setDoc(chatRef, {
          chatId: chatId,
          participants: [senderId, receiverId],
          lastMessage: lastMessage,
          lastMessageType: messageType,
          lastMessageTime: serverTimestamp(),
          lastMessageSenderId: senderId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      } catch (createError) {
        console.error('Error creating chat:', createError);
      }
    }
  };

  // Load messages for a specific chat
  const loadMessages = (otherUserId) => {
    if (!currentUser || !otherUserId) return () => {};

    const messagesQuery = query(
      collection(db, 'messages'),
      where('senderId', 'in', [currentUser.uid, otherUserId]),
      where('receiverId', 'in', [currentUser.uid, otherUserId]),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const messageList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        // Only include messages between current user and other user
        if ((data.senderId === currentUser.uid && data.receiverId === otherUserId) ||
            (data.senderId === otherUserId && data.receiverId === currentUser.uid)) {
          messageList.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate() || new Date()
          });
        }
      });
      setMessages(messageList);
    });

    return unsubscribe;
  };

  // Load user's chats
  const loadChats = () => {
    if (!currentUser) return () => {};

    const chatsQuery = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', currentUser.uid),
      orderBy('lastMessageTime', 'desc')
    );

    const unsubscribe = onSnapshot(chatsQuery, (snapshot) => {
      const chatList = [];
      snapshot.forEach((doc) => {
        chatList.push({
          id: doc.id,
          ...doc.data(),
          lastMessageTime: doc.data().lastMessageTime?.toDate() || new Date()
        });
      });
      setChats(chatList);
    });

    return unsubscribe;
  };

  // Mark messages as read
  const markMessagesAsRead = async (otherUserId) => {
    if (!currentUser) return;

    try {
      const messagesQuery = query(
        collection(db, 'messages'),
        where('senderId', '==', otherUserId),
        where('receiverId', '==', currentUser.uid),
        where('isRead', '==', false)
      );

      const snapshot = await getDocs(messagesQuery);
      
      const updatePromises = snapshot.docs.map(doc => 
        updateDoc(doc.ref, { isRead: true })
      );

      await Promise.all(updatePromises);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Search users
  const searchUsers = async (searchTerm) => {
    if (!searchTerm.trim()) return [];

    try {
      const usersQuery = query(
        collection(db, 'users'),
        where('displayName', '>=', searchTerm),
        where('displayName', '<=', searchTerm + '\uf8ff'),
        limit(10)
      );

      const snapshot = await getDocs(usersQuery);
      const users = [];
      
      snapshot.forEach((doc) => {
        const userData = doc.data();
        // Don't include current user in search results
        if (userData.uid !== currentUser?.uid) {
          users.push({
            id: doc.id,
            ...userData
          });
        }
      });

      return users;
    } catch (error) {
      console.error('Error searching users:', error);
      return [];
    }
  };

  // Start a new chat
  const startChat = async (otherUser) => {
    try {
      // If we only have uid, fetch the full user data
      if (otherUser.uid && !otherUser.displayName) {
        const userDoc = await getDoc(doc(db, 'users', otherUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setActiveChat({
            uid: otherUser.uid,
            displayName: userData.displayName,
            email: userData.email,
            photoURL: userData.photoURL
          });
        } else {
          setActiveChat(otherUser);
        }
      } else {
        setActiveChat(otherUser);
      }
    } catch (error) {
      console.error('Error starting chat:', error);
      setActiveChat(otherUser);
    }
  };

  // Add user to contacts
  const addToContacts = async (userToAdd) => {
    if (!currentUser || !userToAdd) return;

    try {
      const contactRef = doc(db, 'contacts', `${currentUser.uid}_${userToAdd.uid}`);
      
      await setDoc(contactRef, {
        userId: currentUser.uid,
        contactId: userToAdd.uid,
        contactName: userToAdd.displayName,
        contactEmail: userToAdd.email,
        contactPhotoURL: userToAdd.photoURL,
        addedAt: serverTimestamp(),
        isFavorite: false
      });

      console.log('✅ Contact added successfully');
    } catch (error) {
      console.error('Error adding contact:', error);
      throw error;
    }
  };

  // Remove user from contacts
  const removeFromContacts = async (contactId) => {
    if (!currentUser || !contactId) return;

    try {
      const contactRef = doc(db, 'contacts', `${currentUser.uid}_${contactId}`);
      await updateDoc(contactRef, { deletedAt: serverTimestamp() });
      console.log('✅ Contact removed successfully');
    } catch (error) {
      console.error('Error removing contact:', error);
      throw error;
    }
  };

  // Load user's contacts
  const loadContacts = () => {
    if (!currentUser) return () => {};

    const contactsQuery = query(
      collection(db, 'contacts'),
      where('userId', '==', currentUser.uid),
      where('deletedAt', '==', null),
      orderBy('contactName', 'asc')
    );

    const unsubscribe = onSnapshot(contactsQuery, (snapshot) => {
      const contactList = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.deletedAt) {
          contactList.push({
            id: doc.id,
            ...data,
            addedAt: data.addedAt?.toDate() || new Date()
          });
        }
      });
      setContacts(contactList);
    });

    return unsubscribe;
  };

  // Check if user is in contacts
  const isInContacts = (userId) => {
    return contacts.some(contact => contact.contactId === userId);
  };

  const value = {
    messages,
    chats,
    contacts,
    activeChat,
    loading,
    sendMessage,
    sendImageMessage,
    loadMessages,
    loadChats,
    loadContacts,
    markMessagesAsRead,
    searchUsers,
    startChat,
    setActiveChat,
    addToContacts,
    removeFromContacts,
    isInContacts
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}; 