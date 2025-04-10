import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ConfirmationModalProps {
    isOpen: any
    onClose: () => void
    onConfirm: ()=> void
    loading: boolean
  }

const ConfirmationModal = ({ isOpen, onClose, onConfirm, loading }: ConfirmationModalProps) => {
  return (
    <Transition appear show={isOpen !== false} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 p-6 -m-6 mb-6">
                  <Dialog.Title as="h3" className="text-2xl font-bold text-white">
                    Confirm Deletion
                  </Dialog.Title>
                </div>
                <p className="text-gray-700 text-lg mb-4">
                Are you sure you want to delete this post? This action is permanent and cannot be reversed.
                </p>
                <div className="mt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={onConfirm}
                    className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm transform hover:scale-105 active:scale-95"
                  >
                    {loading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                      ) : (
                        "Confirm"
                      )}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ConfirmationModal;
