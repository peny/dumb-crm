import { useForm } from 'react-hook-form'
import { useState } from 'react'

const DealForm = ({ deal, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: deal || {
      title: '',
      description: '',
      value: '',
      status: 'open'
    }
  })

  const handleFormSubmit = async (data) => {
    setLoading(true)
    try {
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
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Title *
        </label>
        <input
          type="text"
          id="title"
          {...register('title', { required: 'Title is required' })}
          className="input"
          placeholder="Enter deal title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="input"
          rows={3}
          placeholder="Enter deal description"
        />
      </div>

      <div>
        <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
          Value *
        </label>
        <input
          type="number"
          id="value"
          step="0.01"
          min="0"
          {...register('value', { 
            required: 'Value is required',
            min: { value: 0, message: 'Value must be positive' }
          })}
          className="input"
          placeholder="Enter deal value"
        />
        {errors.value && (
          <p className="mt-1 text-sm text-red-600">{errors.value.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="input"
        >
          <option value="open">Open</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
        </select>
      </div>

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
          {loading ? 'Saving...' : (deal ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  )
}

export default DealForm
