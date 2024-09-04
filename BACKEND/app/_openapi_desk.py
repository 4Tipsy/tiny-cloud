
# description.md
desk = """
<img src="http://tiny-cloud.xyz/api/utils-service/uwu" alt="uwu.png">

### Tiny-Cloud-API is ~~small python~~ kotlin app designed to store and manage files in cloud

Once small and tiny, now overcomplicated and fully overwritten...  
App is made with `Kotlin` (Ktor) and MongoDB, Redis. Covered with 0 tests, but fully operational!


---
- Each user has default `10 GB` of free space, this number can be increased personally
- Files and directories could be shared with outer web via `share-service`
- Passwords are stored in hashed way, auth made as web-sessions

---

**Clients:**


- [Web Client](http://tiny-cloud.xyz)
- [CLI](https://github.com/4Tipsy/tiny-cloud-cli)

**Links:**


- [Redoc](/api/redoc)
- [Rapidoc](/api/rapidoc)
- [Source (GitHub)](https://github.com/4Tipsy/tiny-cloud/tree/main/BACKEND)
---
All routes are bellow:
"""




#
# exec to get `desk` as 1 line
#
print( desk.replace('\n', '\\n').replace('"', '\\"') )
