# Use official ASP.NET Core runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base

# Set working directory
WORKDIR /app

# Expose ports
EXPOSE 8080 8081

# Build stage
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release

WORKDIR /src

# Copy .csproj and restore
COPY RecipeWebApp.csproj ./
RUN dotnet restore RecipeWebApp.csproj

# Copy everything else in the RecipeWebApp folder
COPY . ./
RUN dotnet build RecipeWebApp.csproj -c $BUILD_CONFIGURATION -o /app/build

# Publish stage
FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish RecipeWebApp.csproj -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

# Final runtime image
FROM base AS final
WORKDIR /app

# Copy published files
COPY --from=publish /app/publish .

# Run the app
ENTRYPOINT ["dotnet", "RecipeWebApp.dll"]
