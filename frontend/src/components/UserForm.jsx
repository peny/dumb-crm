import { useForm } from 'react-hook-form'
import { useState } from 'react'

const UserForm = ({ user, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm({
    defaultValues: user || {
      name: '',
      email: '',
      password: '',
      role: 'user',
      isActive: true
    }
  })

  const isEditing = !!user
  const watchRole = watch('role')

  const handleFormSubmit = async (data) => {
    setLoading(true)
    try {
      // Remove password field if editing and password is empty
      if (isEditing && !data.password) {
        delete data.password
      }
      
      await onSubmit(data)
      reset()
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Name *
        </label>
        <input
          type="text"
          id="name"
          {...register('name', { required: 'Name is required' })}
          className="input"
          placeholder="Enter full name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          {...register('email', { 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          })}
          className="input"
          placeholder="Enter email address"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Password {isEditing ? '(leave empty to keep current)' : '*'}
        </label>
        <input
          type="password"
          id="password"
          {...register('password', { 
            required: !isEditing ? 'Password is required' : false,
            minLength: isEditing ? undefined : { value: 6, message: 'Password must be at least 6 characters' }
          })}
          className="input"
          placeholder={isEditing ? "Enter new password (optional)" : "Enter password"}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
          Role *
        </label>
        <select
          id="role"
          {...register('role', { required: 'Role is required' })}
          className="input"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
        )}
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            {...register('isActive')}
            className="rounded border-gray-300 text-primary-600 shadow-sm focus:border-primary-300 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
          />
          <span className="ml-2 text-sm text-gray-700">Active user</span>
        </label>
        <p className="mt-1 text-xs text-gray-500">
          Inactive users cannot log in to the system
        </p>
      </div>

      {watchRole === 'admin' && (
        <div className="p-3 bg-purple-50 border border-purple-200 rounded-md">
          <p className="text-sm text-purple-800">
            <strong>Admin users</strong> have full access to the system including user management.
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn btn-secondary"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={loading}
        >
          {loading ? 'Saving...' : (isEditing ? 'Update User' : 'Create User')}
        </button>
      </div>
    </form>
  )
}

export default UserForm
