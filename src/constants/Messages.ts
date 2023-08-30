const StringMessages = {
  user: {
    user_created_success: 'The user is created successfully',
    user_created_error: 'The user is not created',
    user_database_error: 'The user is unable to create in database',
    user_email_already_exists: 'The user already exists',
    single_user_found: 'The user has been found successfully',
    single_user_not_found: 'The user does not exist',
    single_user_not_found_database: 'The user does not exist in database',
    multiple_user_found: 'The users have been found succssfully',
    multiple_user_not_found: 'The user with this email does not exist',
    multiple_user_not_found_database:
      'The user with this email does not exist in the database',
    update_user_success:"The user is updated successfully",
    update_user_fail:"The user cannot be updated",
    delete_user_success:"The user has been deleted successfully",
    delete_user_fail:"The user cannot be deleted",
    delete_user_database_error:"The user is unable to be deleted in the database"  
  },
} as const;

export default StringMessages;
