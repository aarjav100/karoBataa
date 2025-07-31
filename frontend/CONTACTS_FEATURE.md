# Contacts Feature

## Overview
The chat application now includes a comprehensive contacts management system that allows users to add, view, and manage their contacts.

## Features

### 1. Add to Contacts
- Users can add other users to their contacts list
- Click the "UserPlus" icon next to any user in search results
- Contacts are stored in Firestore with user information

### 2. Contacts View
- Access contacts by clicking the phone icon in the sidebar header
- View all added contacts with their names and emails
- Search through contacts using the search bar
- Click on any contact to start a chat

### 3. Remove from Contacts
- Remove contacts by clicking the "UserMinus" icon
- Available in both search results and contacts view
- Soft delete - contacts are marked as deleted but not permanently removed

### 4. Contact Status Indicators
- Visual indicators show if a user is already in your contacts
- Blue "UserPlus" icon for users not in contacts
- Red "UserMinus" icon for users already in contacts
- Loading spinner while adding/removing contacts

## Database Structure

### Contacts Collection
```javascript
{
  userId: "current_user_id",
  contactId: "contact_user_id", 
  contactName: "Contact Display Name",
  contactEmail: "contact@email.com",
  contactPhotoURL: "https://...",
  addedAt: timestamp,
  isFavorite: false,
  deletedAt: null // Soft delete
}
```

## UI Components

### Sidebar Header
- Phone icon: Toggle contacts view
- Plus icon: Toggle search view
- Logout icon: Sign out

### Search Results
- UserPlus/UserMinus buttons for contact management
- Loading states during operations
- Visual feedback for contact status

### Contacts List
- Contact cards with avatar, name, and email
- Remove button for each contact
- Empty state with helpful messaging

## Usage

1. **Adding Contacts**:
   - Click the Plus icon to search for users
   - Find a user and click the UserPlus icon
   - User is added to your contacts

2. **Viewing Contacts**:
   - Click the Phone icon in the header
   - Browse your contacts list
   - Search through contacts if needed

3. **Starting Chats**:
   - Click on any contact to start a chat
   - Or click on search results to chat with users

4. **Removing Contacts**:
   - Click the UserMinus icon next to any contact
   - Contact is removed from your list

## Technical Implementation

### Context Functions
- `addToContacts(user)`: Add user to contacts
- `removeFromContacts(contactId)`: Remove contact
- `loadContacts()`: Load user's contacts
- `isInContacts(userId)`: Check if user is in contacts

### State Management
- `contacts`: Array of user's contacts
- `showContacts`: Toggle contacts view
- `addingContact`: Loading state for contact operations

### Real-time Updates
- Contacts list updates in real-time using Firestore listeners
- Changes are reflected immediately across all connected clients 