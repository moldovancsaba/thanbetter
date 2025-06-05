# Development Patterns and Best Practices

Last Updated: 2025-06-05T17:00:47.000Z

## CRUD Operations

### Simple Edit and Delete Pattern

We discovered that keeping CRUD operations simple and straightforward is the best approach. Here's our recommended pattern:

#### Frontend Component
```typescript
export default function UsersList({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleEdit = async (id) => {
    if (editingId === id) {
      try {
        const response = await fetch('/api/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, username: editValue })
        });

        if (!response.ok) throw new Error('Update failed');

        // Update local state immediately after successful API call
        setUsers(users.map(item => 
          item._id === id ? { ...item, username: editValue } : item
        ));
        setEditingId(null);
      } catch (error) {
        console.error('Failed to update:', error);
      }
    } else {
      // Enter edit mode
      const item = users.find(u => u._id === id);
      setEditValue(item.username);
      setEditingId(id);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`/api/users?id=${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) throw new Error('Delete failed');

      // Update local state immediately
      setUsers(users.filter(item => item._id !== id));
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };
}
```

#### API Route
```typescript
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectToDatabase();

    switch (req.method) {
      case 'GET':
        const items = await Model.find({});
        return res.status(200).json(items);

      case 'PUT':
        const { id, username } = req.body;
        const updated = await Model.findByIdAndUpdate(
          id,
          { username },
          { new: true }
        );
        return res.status(200).json(updated);

      case 'DELETE':
        const userId = req.query.id;
        await Model.findByIdAndDelete(userId);
        return res.status(200).json({ message: 'Deleted successfully' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
```

### Key Learnings

1. **State Management Simplicity**
   - Keep state in a single component when possible
   - Update state immediately after successful API calls
   - Use optimistic updates for better UX

2. **API Design**
   - Keep API routes simple and focused
   - Use standard HTTP methods appropriately
   - Return updated data in responses

3. **Error Handling**
   - Handle errors both in frontend and backend
   - Provide clear error messages
   - Maintain state consistency on error

4. **Timestamps**
   - Always include `createdAt` and `updatedAt` in models
   - Use ISO 8601 format with milliseconds (YYYY-MM-DDThh:mm:ss.sssZ)
   - Update timestamps automatically through MongoDB

### Common Issues and Solutions

1. **Issue**: Complex state management leading to bugs
   **Solution**: Simplified state management in single component

2. **Issue**: Inconsistent state after operations
   **Solution**: Immediate state updates after successful API calls

3. **Issue**: Complicated error handling
   **Solution**: Centralized error handling with clear messages

4. **Issue**: Missing timestamps in records
   **Solution**: Automatic timestamp management through MongoDB schema

