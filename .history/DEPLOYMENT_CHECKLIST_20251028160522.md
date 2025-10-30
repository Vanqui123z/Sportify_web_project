# 📋 Admin AI Chatbox - Deployment Checklist

## PRE-DEPLOYMENT

### Database
- [ ] MySQL server running
- [ ] Database `sportify_db` exists
- [ ] SQL migration script ready: `Database/admin_ai_chat_history.sql`
- [ ] Backup of current database created

### Backend
- [ ] Java 11+ installed
- [ ] Maven installed
- [ ] Backend source code ready
- [ ] Gemini API key configured in `application.properties`
- [ ] Port 8081 available (or configured)

### Frontend
- [ ] Node.js 16+ installed
- [ ] npm/yarn installed
- [ ] Frontend source code ready
- [ ] Port 5173 available (or configured)

---

## DEPLOYMENT STEPS

### Step 1: Database Setup
- [ ] SSH into database server (or use MySQL GUI)
- [ ] Run: `mysql -u root -p sportify_db < Database/admin_ai_chat_history.sql`
- [ ] Verify table created: `SHOW TABLES LIKE 'admin_ai%'`
- [ ] Check table structure: `DESCRIBE admin_ai_chat_history`

### Step 2: Backend Build & Deploy
- [ ] Navigate: `cd SportifyBackend`
- [ ] Clean build: `mvn clean`
- [ ] Install dependencies: `mvn install`
- [ ] Compile: `mvn compile`
- [ ] Package: `mvn package`
- [ ] Run tests (optional): `mvn test`
- [ ] Start server: `mvn spring-boot:run` or `java -jar target/*.jar`
- [ ] Check backend log for errors
- [ ] Verify port 8081 is listening: `netstat -an | grep 8081` (or use browser)

### Step 3: Frontend Build & Deploy
- [ ] Navigate: `cd SportifyFrontend`
- [ ] Install dependencies: `npm install`
- [ ] Build: `npm run build`
- [ ] Start dev server: `npm run dev` or `npm run preview`
- [ ] Check frontend log for errors
- [ ] Verify port 5173 is listening

---

## VERIFICATION TESTS

### API Endpoints
- [ ] Test backend health: `curl http://localhost:8081`
- [ ] Test admin chat endpoint: 
  ```bash
  curl -X POST http://localhost:8081/sportify/rest/ai/admin-chat \
    -H "Content-Type: application/json" \
    -d '{"message": "Danh sách sản phẩm"}'
  ```
- [ ] Test history endpoints: 
  ```bash
  curl http://localhost:8081/sportify/rest/ai/admin/history/all
  ```

### Frontend Access
- [ ] Open browser: `http://localhost:5173/admin/dashboard`
- [ ] Login with Admin credentials
- [ ] See 🤖 button in bottom right corner
- [ ] Click 🤖 to open chatbox
- [ ] Verify chatbox UI loads

### Chatbox Functionality
- [ ] Click quick reply button
- [ ] Receive AI response
- [ ] Type custom message
- [ ] Receive AI response
- [ ] Upload file
- [ ] Receive AI response with file analysis
- [ ] Close chatbox
- [ ] Reopen chatbox
- [ ] See chat history restored
- [ ] Click 🗑️ to clear history
- [ ] Verify history cleared

### Database Persistence
- [ ] After chatting, verify database: 
  ```sql
  SELECT * FROM admin_ai_chat_history ORDER BY created_at DESC LIMIT 5;
  ```
- [ ] See messages and responses saved
- [ ] Verify `adminId` is recorded
- [ ] Verify `created_at` timestamp is correct

### localStorage
- [ ] Open browser Developer Tools (F12)
- [ ] Application → localStorage
- [ ] Look for `adminaichatbox_adminId`
- [ ] Look for `adminaichatbox_messages`
- [ ] Verify JSON content

---

## PERFORMANCE TESTS

### Response Time
- [ ] Chat response: ⏱️ Should be <2 seconds
- [ ] File upload: ⏱️ Should be <5 seconds
- [ ] History load: ⏱️ Should be <500ms

### Load Testing (Optional)
- [ ] Send 10 consecutive messages
- [ ] Verify all responses received
- [ ] Check for memory leaks
- [ ] Monitor CPU usage: Should stay <50%
- [ ] Monitor RAM usage: Should stay <500MB

---

## SECURITY TESTS

### Access Control
- [ ] Login as regular user
- [ ] Verify cannot access admin dashboard
- [ ] Cannot see 🤖 button
- [ ] Cannot access API endpoints

### API Security
- [ ] Invalid message format → Error response
- [ ] Empty message → Validation error
- [ ] Large file upload → Size limit check
- [ ] SQL injection attempt → Sanitized safely

### CORS
- [ ] Request from same origin: ✅ Works
- [ ] Request from different origin: Check if allowed

---

## ERROR HANDLING TESTS

### Simulate Failures
- [ ] Stop backend → Frontend shows error
- [ ] Stop database → Backend shows error
- [ ] Invalid Gemini API key → Friendly error message
- [ ] Network timeout → Auto-retry (should try 3 times)

### Error Messages
- [ ] All errors user-friendly (in Vietnamese)
- [ ] No sensitive info exposed
- [ ] Console shows detailed logs (dev mode)

---

## BROWSER COMPATIBILITY

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## RESPONSIVE DESIGN

- [ ] Desktop (1920x1080): ✅ Works
- [ ] Laptop (1366x768): ✅ Works
- [ ] Tablet (768x1024): ✅ Works
- [ ] Mobile (375x667): ✅ Works
- [ ] FAB button visible: ✅ All sizes
- [ ] Chatbox scrollable: ✅ All sizes

---

## DOCUMENTATION REVIEW

- [ ] QUICK_START.md reviewed
- [ ] ADMIN_CHATBOX_GUIDE.md reviewed
- [ ] ADMIN_CHANGES_SUMMARY.md reviewed
- [ ] README_ADMIN_CHATBOX.md reviewed
- [ ] API documentation clear
- [ ] Setup instructions accurate
- [ ] Troubleshooting guide helpful

---

## CONFIGURATION REVIEW

### Backend Properties
- [ ] Database URL correct: `application.properties`
- [ ] Gemini API key configured
- [ ] API endpoint URLs correct
- [ ] CORS origins configured
- [ ] Server port correct (8081)

### Frontend Configuration
- [ ] API endpoints point to correct backend URL
- [ ] localStorage keys named correctly
- [ ] Environment variables set
- [ ] Build output optimized

---

## DEPLOYMENT SIGN-OFF

### Technical Lead
- [ ] Code review passed
- [ ] All tests passed
- [ ] Security review passed
- [ ] Performance acceptable
- [ ] Sign-off date: ____________

### QA Team
- [ ] Functional testing complete
- [ ] All test cases passed
- [ ] No critical bugs
- [ ] Documentation accurate
- [ ] Sign-off date: ____________

### DevOps/Deployment
- [ ] Infrastructure ready
- [ ] Deployment scripts tested
- [ ] Rollback plan ready
- [ ] Monitoring configured
- [ ] Sign-off date: ____________

---

## POST-DEPLOYMENT

### Monitoring (First 24 Hours)
- [ ] Check error logs hourly
- [ ] Monitor CPU/RAM usage
- [ ] Monitor database size
- [ ] Monitor API response times
- [ ] Monitor user feedback

### Analytics (First Week)
- [ ] Track admin usage
- [ ] Track feature popularity
- [ ] Identify bottlenecks
- [ ] Gather user feedback
- [ ] Identify improvements

### Weekly Review
- [ ] Server health check
- [ ] Database optimization
- [ ] API performance review
- [ ] Security audit
- [ ] Plan improvements

---

## ROLLBACK PLAN

If issues occur:

### Quick Rollback
1. Revert frontend to previous version
2. Revert backend to previous version
3. Keep database (preserve chat history)

### Full Rollback
1. Restore database backup
2. Restore backend from previous build
3. Restore frontend from previous build

**Rollback Command:**
```bash
# Backend
git checkout main
mvn clean install
mvn spring-boot:run

# Frontend
git checkout main
npm install
npm run build
```

---

## FINAL CHECKLIST

### Ready for Production?
- [ ] All tests passed
- [ ] All issues resolved
- [ ] All documentation complete
- [ ] Team approved
- [ ] Monitoring configured
- [ ] Backup created
- [ ] Rollback plan ready

### Go/No-Go Decision
- [ ] **GO**: ✅ Production ready, proceed with deployment
- [ ] **NO-GO**: ❌ Issues found, delay deployment

**Decision Date**: ____________  
**Decided By**: ____________  
**Status**: ✅ GO / ❌ NO-GO

---

## DEPLOYMENT EXECUTION LOG

```
[Timestamp] Step Started: _________________
[Timestamp] Step Completed: _________________
[Timestamp] Issues Encountered: _________________
[Timestamp] Issues Resolved: _________________
[Timestamp] Deployment Complete: _________________
[Timestamp] Verification Complete: _________________
[Timestamp] Go-Live Time: _________________
```

---

## CONTACT & SUPPORT

### During Deployment
- **Backend Issues**: Backend team
- **Frontend Issues**: Frontend team
- **Database Issues**: Database team
- **General Issues**: DevOps team

### Emergency Contact
- **On-call Engineer**: ____________
- **Backup Engineer**: ____________
- **Escalation**: ____________

---

## NOTES

```
Additional Notes:
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
```

---

**Deployment Checklist Version**: 1.0  
**Last Updated**: 2025-10-28  
**Status**: Ready for Use

Good luck with deployment! 🚀
