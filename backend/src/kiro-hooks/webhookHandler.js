const { updateGraph } = require('../utils/graphUpdater');

/**
 * Handles incoming webhooks from Kiro
 * @param {Object} payload - The webhook payload from Kiro
 * @returns {Object} - Response object
 */
async function handleKiroWebhook(payload) {
  console.log('🎣 Kiro Webhook Received:', payload);
  
  try {
    // Extract relevant information from Kiro's payload
    const eventType = payload.event || 'unknown';
    const changedFiles = payload.files || [];
    const projectPath = payload.projectPath || process.env.TARGET_PROJECT_PATH;

    // Check if the spec file was modified
    const specModified = changedFiles.some(file => 
      file.includes('.kiro/spec.md') || file.includes('.kiro/')
    );

    if (specModified || eventType === 'spec_updated') {
      console.log('📄 Spec file modified - updating graph...');
      await updateGraph();
      return { 
        success: true, 
        message: 'Graph updated successfully due to spec changes',
        event: eventType 
      };
    }

    // Check if code files were modified that might affect architecture
    const codeModified = changedFiles.some(file => 
      file.endsWith('.js') || file.endsWith('.py') || 
      file.endsWith('.ts') || file.endsWith('.java')
    );

    if (codeModified) {
      console.log('💻 Code files modified - analyzing architecture impact...');
      await updateGraph();
      return { 
        success: true, 
        message: 'Graph updated due to code changes',
        event: eventType 
      };
    }

    return { 
      success: true, 
      message: 'Webhook received but no relevant changes detected',
      event: eventType 
    };

  } catch (error) {
    console.error('❌ Error handling Kiro webhook:', error);
    return { 
      success: false, 
      message: 'Error processing webhook',
      error: error.message 
    };
  }
}

module.exports = { handleKiroWebhook };