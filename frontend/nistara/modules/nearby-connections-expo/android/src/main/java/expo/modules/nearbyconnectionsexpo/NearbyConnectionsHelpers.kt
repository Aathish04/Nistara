package expo.modules.nearbyconnectionsexpo

import android.os.Bundle

import expo.modules.interfaces.permissions.Permissions
import expo.modules.kotlin.exception.CodedException
import expo.modules.kotlin.Promise
import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

import java.io.Serializable

import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class NearbyConnectionsHelpers {
  companion object {
    // Decorator for Permissions.getPermissionsWithPermissionsManager, for use in Kotlin coroutines
    internal suspend fun getPermissionsWithPermissionsManager(contextPermissions: Permissions, vararg permissionStrings: String): PermissionRequestResponse {
      return suspendCoroutine { continuation ->
        Permissions.getPermissionsWithPermissionsManager(
          contextPermissions,
          object : Promise {
            override fun resolve(value: Any?) {
              val result = value as? Bundle
                ?: throw ConversionException(Any::class.java, Bundle::class.java, "value returned by the permission promise is not a Bundle")
              continuation.resume(PermissionRequestResponse(result))
            }

            override fun reject(code: String, message: String?, cause: Throwable?) {
              continuation.resumeWithException(CodedException(code, message, cause))
            }
          },
          *permissionStrings
        )
      }
    }

    // Decorator for Permissions.getPermissionsWithPermissionsManager, for use in Kotlin coroutines
    internal suspend fun askForPermissionsWithPermissionsManager(contextPermissions: Permissions, vararg permissionStrings: String): Bundle {
      return suspendCoroutine {
        Permissions.askForPermissionsWithPermissionsManager(
          contextPermissions,
          object : Promise {
            override fun resolve(value: Any?) {
              it.resume(
                value as? Bundle
                  ?: throw ConversionException(Any::class.java, Bundle::class.java, "value returned by the permission promise is not a Bundle")
              )
            }

            override fun reject(code: String, message: String?, cause: Throwable?) {
              it.resumeWithException(CodedException(code, message, cause))
            }
          },
          *permissionStrings
        )
      }
    }
  }
}

internal class PermissionRequestResponse(
  @Field var canAskAgain: Boolean?,
  @Field var expires: String?,
  @Field var granted: Boolean,
  @Field var status: String?,
  @Field var android: PermissionDetailsLocationAndroid?
) : Record, Serializable {
  constructor(bundle: Bundle) : this(
    canAskAgain = bundle.getBoolean("canAskAgain"),
    expires = bundle.getString("expires")
      ?: throw ConversionException(Bundle::class.java, PermissionRequestResponse::class.java, "value under `expires` key is undefined"),
    granted = bundle.getBoolean("granted"),
    status = bundle.getString("status")
      ?: throw ConversionException(Bundle::class.java, PermissionRequestResponse::class.java, "value under `status` key is undefined"),
    android = bundle.getBundle("android")?.let { PermissionDetailsLocationAndroid(it) }
  )
}

internal class PermissionDetailsLocationAndroid(
  @Field var accuracy: String
) : Record, Serializable {
  constructor(bundle: Bundle) : this(
    accuracy = (bundle.getString("accuracy") ?: "none")
  )
}

internal class NoPermissionsModuleException :
  CodedException("Permissions module is null. Are you sure all the installed Expo modules are properly linked?")

internal class ConversionException(fromClass: Class<*>, toClass: Class<*>, message: String? = "") :
  CodedException("Couldn't cast from ${fromClass::class.simpleName} to ${toClass::class.java.simpleName}: $message")
