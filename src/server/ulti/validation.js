const getRole = require('./getRole')

async function validateUserInput(userData) {
    const { email, password, confirmPass, phoneNumber, firstName, lastName, roles } = userData;

    // Validating email
    if (!isValidEmail(email)) {
        return "Email is not valid.";
    }

    // Validating password
    if (password !== confirmPass) {
        return "Passwords do not match.";
    }

    // Validating phoneNumber
    if (!isValidPhoneNumber(phoneNumber)) {
        return "Phone number is not valid.";
    }

    // Validating firstName and lastName
    if (!firstName || !lastName) {
        return "First name and last name cannot be null.";
    }

    // Fetch roles from LDAP
    let validRoles;
    try {
        validRoles = await getRole();
    } catch (error) {
        console.error("Error fetching roles from LDAP:", error);
        return "Error fetching roles.";
    }

    // Validating roles
    for (const role of roles) {
        if (!validRoles.includes(role)) {
            return `Role '${role}' is not valid.`;
        }
    }

    // All validations passed
    return null;
}

function isValidEmail(email) {
    // Use a regular expression to validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhoneNumber(phoneNumber) {
    // Use a regular expression to validate phone number format (10 digits)
    const phoneNumberRegex = /^\d{10}$/;
    return phoneNumberRegex.test(phoneNumber);
}

module.exports = validateUserInput